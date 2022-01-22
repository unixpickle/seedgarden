package rarbg

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"sync"
	"time"

	"github.com/unixpickle/essentials"
)

const (
	Endpoint = "https://torrentapi.org/pubapi_v2.php"
	AppID    = "seedgarden"
)

const (
	TokenTimeout = time.Minute * 10
	RequestRate  = time.Second * 2
)

const InvalidTokenErrorCode = 4

type RARBG struct {
	requestLock sync.Mutex
	token       string
	tokenStart  time.Time
	lastRequest time.Time
}

func (r *RARBG) SlangName() string {
	return "On RARBG"
}

func (r *RARBG) makeRequest(params map[string]string, response interface{}) error {
	r.requestLock.Lock()
	defer r.requestLock.Unlock()

	if r.token == "" || time.Since(r.tokenStart) > TokenTimeout {
		if err := r.fetchToken(); err != nil {
			return err
		}
	}

	for _, tryToken := range []bool{true, false} {
		body, err := r.makeRawRequest(params)
		if err != nil {
			return err
		}
		var errResponse struct {
			Error string `json:"error"`
			Code  int    `json:"error_code"`
		}
		if err := json.Unmarshal(body, &errResponse); err == nil {
			if tryToken && errResponse.Code == InvalidTokenErrorCode {
				// Address race condition where the token expires as
				// we make the new request.
				if err := r.fetchToken(); err != nil {
					return err
				}
				continue
			} else if errResponse.Error != "" {
				return fmt.Errorf("%s (code %d)", errResponse.Error, errResponse.Code)
			}
		}
		return json.Unmarshal(body, response)
	}
	panic("unreachable")
}

func (r *RARBG) makeRawRequest(params map[string]string) ([]byte, error) {
	defer r.updateRequestTime()

	// The order of arguments matters; token must come first.
	qv1 := url.Values{}
	qv1.Add("token", r.token)

	// Non-token arguments.
	qv2 := url.Values{}
	for k, v := range params {
		qv2.Set(k, v)
	}
	qv2.Set("app_id", AppID)

	r.waitRateLimit()
	resp, err := http.Get(Endpoint + "?" + qv1.Encode() + "&" + qv2.Encode())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return ioutil.ReadAll(resp.Body)
}

func (r *RARBG) fetchToken() (err error) {
	defer essentials.AddCtxTo("fetch API token", &err)
	defer r.updateRequestTime()
	r.tokenStart = time.Now()
	r.token = ""
	r.waitRateLimit()
	resp, err := http.Get(Endpoint + "?get_token=get_token&app_id=" + AppID)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	var response struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(body, &response); err != nil {
		return err
	}
	if response.Token == "" {
		return errors.New("missing token in response")
	}
	r.token = response.Token
	return nil
}

func (r *RARBG) waitRateLimit() {
	sinceLast := time.Since(r.lastRequest)
	if sinceLast < RequestRate {
		time.Sleep(RequestRate - sinceLast)
	}
}

func (r *RARBG) updateRequestTime() {
	r.lastRequest = time.Now()
}
