const { verify_jwt } = require("../controlller/index");

class chat {
  io;
  connections = []; // for socket connected user array
  userListInfo = []; // for user list to client for online chat

  constructor(io) {
    this.io = io;

    this._startconnection();
  }

  _startconnection() {
    this.io.on("connection", socket => {
      socket.on("fromclient", msg => {
        try {
          let data_obj = JSON.parse(msg);
          let token = verify_jwt(data_obj.auth.split("=")[1]);

          let sendto = this._sendtoclient(data_obj.to);

          sendto.emit("recvdata", msg);
        } catch (err) {
          socket.emit(
            "failure",
            JSON.stringify({
              err: "failed"
            })
          );
        }
      });

      socket.on("sendfirsttime", msg => {
        try {
          let token = JSON.parse(msg).data.split("=")[1];

          let user_data = verify_jwt(token);

          let list_user = {
            socket: socket,
            email: user_data.email
          };

          this.connections.push(list_user);
          this.userListInfo.push(user_data);

          socket.emit("recfirsttime", JSON.stringify(user_data));

          this.io.emit("useradded", JSON.stringify(this.userListInfo));
        } catch (err) {
          socket.emit(
            "recfirsttime",
            JSON.stringify({
              err: "tokenInvalid"
            })
          );
        }
      });
      socket.on("disconnect", () => {
        this._removeUser(socket);

        this.io.emit("useradded", JSON.stringify(this.userListInfo));
      });
    });
  }

  _removeUser(_soc) {
    for (let i of this.connections) {
      if (i.socket == _soc) {
        this.connections.splice(this.connections.indexOf(i), 1);
        for (let j of this.userListInfo) {
          if (i.email == j.email) {
            this.userListInfo.splice(this.userListInfo.indexOf(j), 1);
          }
        }
        break;
      }
    }
  }

  _sendtoclient(_email) {
    for (let i of this.connections) {
      if (_email == i.email) {
        return i.socket;
      }
    }
  }
}

module.exports = {
  chat
};
