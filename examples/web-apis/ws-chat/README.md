# WebSockets-based Chat

This package uses Agata and the websockets wrapper to provide a small
chat application. You need to run the `chat-server.js` separately in
this folder to start the websocket server before you run the application.

Run with:

    # The `&` at the end means "do not wait for it to finish".
    # You might also just run the commands in separate shells

    $ node examples/web-apis/ws-chat/chat-server.js &
    $ crochet run-web examples/web-apis/ws-chat/crochet.json
