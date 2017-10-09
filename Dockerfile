FROM mongo:3.0.15
FROM golang:1.8.4-stretch

# Set proxy server, replace host:/port with values for your servers
ENV http_proxy host:/port
ENV https_proxy host:/port

ADD . /code
WORKDIR /code
RUN go get github.com/reubenmiller/smtpd

ADD ./gopath

ENV GOPATH /gopath/app
ENV GOROOT /gopath/app

CMD []