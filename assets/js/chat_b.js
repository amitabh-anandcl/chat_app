/**global variables are here */

let touser = {
  email: null,
  name: null
};

let loggeduser;

let chat_data = [];

let obj = {};
/**
 * strt class chat routing and dispalying content operation
 */
class start {
  socket;
  constructor() {
    this.socket = io();

    this.socket.on("connect", () => {
      let userinfo = {
        data: document.cookie
      };

      this.socket.emit("sendfirsttime", JSON.stringify(userinfo));
      this.socket.on("recfirsttime", msg => {
        let ud = JSON.parse(msg);
        loggeduser = ud.email;
        this._setName(ud.name);
      });

      let m_b = this._("#mess_box");
      m_b.style.display = "none";
      this._initate();
    });
  }

  _initate() {
    this.socket.on("useradded", msg => {
      let userlist = JSON.parse(msg);
      this._setList(userlist);
    });

    this.socket.on("failure", msg => {
      alert("something went wrong");
    });

    this.socket.on("recvdata", msg => {
      let dec = JSON.parse(msg);

      chat_data.push(dec);
      this._incomeData(msg);
    });

    let btn = this._("#btn");

    btn.addEventListener("click", () => {
      let data = this._("#text_data");
      let header = {
        from: loggeduser,
        to: touser.email,
        data: data.value,
        auth: document.cookie
      };

      if (touser == undefined || data.value == "") {
        alert("Enter some text data");
        return;
      }
      chat_data.push(header);

      this.socket.emit("fromclient", JSON.stringify(header));

      data.value = "";

      this._sendData(header);
    });
  }

  _setList(list) {
    let online_id = this._("#list_person");
    online_id.innerHTML = "";

    for (let x of list) {
      if (x.email == loggeduser) {
      } else {
        online_id.innerHTML += `<div id="active_${
          x.email.split("@")[0]
        }" class="chat_list" onclick="_set_chat('${x.email}' , '${x.name}')">
          <div class="chat_people">
              <div class="chat_img"> <img src="/static/pic/user-profile.png" alt="">
              </div>
              <div class="chat_ib">
                      <h5 id="username-${x.email}">${x.name}</h5>
                      <p id="unreadcount-${x.email.split("@")[0]}"></p>
                  </div>
              </div>
        </div>`;
      }
    }
    let key = Object.keys(obj);

    for (let j of key) {
      this._update_unread(obj[key], j);
    }
  }

  /**
   * incoming data to display and current user not active on tab
   * to hold unread msg data
   */
  _incomeData(data) {
    let inc_data = JSON.parse(data);

    let chatbox_id = this._("#chats");

    if (touser.email == inc_data.from) {
      chatbox_id.innerHTML += updateincomedata(inc_data.data);
    } else {
      let key = Object.keys(obj);
      let bool = false;

      if (key.length == 0) {
        obj[inc_data.from] = [];
        obj[inc_data.from].push(inc_data);
      }

      for (let i of key) {
        if (i == inc_data.from) {
          bool = true;
          break;
        }
      }
      if (bool == true) {
        obj[inc_data.from].push(inc_data);
      } else {
        obj[inc_data.from] = [];
        obj[inc_data.from].push(inc_data);
      }

      this._update_unread(obj[inc_data.from], inc_data.from);
    }
  }

  _update_unread(obj, id) {
    let ids = this._("#unreadcount-" + id.split("@")[0]);

    ids.innerText = obj.length;
  }

  _sendData(con_obj) {
    let chatbox_id = this._("#chats");

    chatbox_id.innerHTML += update_outgodata(con_obj.data);
  }

  _setName(name) {
    let name_id = this._("#yourname");
    name_id.innerText = name.toUpperCase();
  }

  _(id) {
    return document.querySelector(id);
  }
}
/**
 * selecting chat option of users there _set_chat
 */
let _set_chat = (email, name) => {
  let m_b = document.querySelector("#mess_box");
  m_b.style.display = "block";

  touser.email = email;
  touser.name = name;

  console.log(email, name);
  let headname = document.querySelector("#user_box_");

  headname.innerText = touser.name;

  delete obj[email];

  update_chat_current_chat(email);
};

function update_chat_current_chat(email) {
  let chatbox_id = document.querySelector("#chats");

  let ids = document.querySelector("#unreadcount-" + email.split("@")[0]);

  ids.innerText = "";

  chatbox_id.innerHTML = "";
  for (let i of chat_data) {
    if (i.from == email || i.to == email) {
      if (loggeduser == i.from) {
        chatbox_id.innerHTML += update_outgodata(i.data);
      } else {
        chatbox_id.innerHTML += updateincomedata(i.data);
      }
    }
  }
}

function updateincomedata(value) {
  return `
          <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src="/static/pic/user-profile.png"
                  alt=""> </div>
              <div class="received_msg">
                  <div class="received_withd_msg">
                      <p>${value}</p>
                  </div>
              </div>
          </div>
      `;
}
function update_outgodata(value) {
  return `
        <div class="outgoing_msg">
            <div class="sent_msg">
                <p>${value}</p>
            </div>
        </div>
    `;
}

window.onload = () => {
  if (location.pathname == "/chat") {
    let c = new start();
  }
};
