package rtorrent

import (
	"bytes"
	"encoding/xml"
	"io/ioutil"
	"net/http"

	"github.com/unixpickle/essentials"
)

// A Client interacts with an rTorrent backend.
type Client struct {
	rpcURL   string
	username string
	password string
}

// NewClientAuth creates a client with HTTP basic auth.
func NewClientAuth(rpcURL, username, password string) *Client {
	return &Client{rpcURL: rpcURL, username: username, password: password}
}

// Call runs an RPC call.
func (c *Client) Call(method string, arguments ...string) (data []byte, err error) {
	defer essentials.AddCtxTo("RPC '"+method+"' call", &err)
	callInfo := objectForCall(method, arguments)
	buf, err := xml.Marshal(callInfo)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest("POST", c.rpcURL, bytes.NewBuffer(buf))
	if err != nil {
		return nil, err
	}
	req.SetBasicAuth(c.username, c.password)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return ioutil.ReadAll(resp.Body)
}

func objectForCall(method string, arguments []string) interface{} {
	if len(arguments) == 1 {
		return singleArgCall{
			XMLName:    xml.Name{Local: "methodCall"},
			MethodName: method,
			SingleArg:  arguments[0],
		}
	} else {
		call := methodCall{MethodName: method}
		for _, arg := range arguments {
			call.Arguments = append(call.Arguments, callArgument{Value: arg})
		}
		return call
	}
}

type methodCall struct {
	MethodName string         `xml:"methodName,rawxml"`
	Arguments  []callArgument `xml:"params>param"`
}

type callArgument struct {
	Value string `xml:"value>string,rawxml"`
}

type singleArgCall struct {
	XMLName    xml.Name
	MethodName string `xml:"methodName,rawxml"`
	SingleArg  string `xml:"params>param>value>string,rawxml"`
}
