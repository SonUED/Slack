import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import firebase from "../../firebase";
class DirectMessages extends React.Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    users: [],
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
  };
  componentDidMount() {
    if (this.state.user) {
      //Uid of Current User
      this.addListeners(this.state.user.uid);
    }
  }
  addListeners = (currentUserUid) => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        //Check Uid !== Uid of user exist
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        console.log(user);

        //Array users chứa tất cả user trong firebase
        this.setState({ users: loadedUsers });
      }
    });
    this.state.connectedRef.on("value", (snap) => {
      //Kiem tra xem trang thai cua user đang đăng nhập nếu là true thi tao element
      // o bang presence set là true
      //Kiem tra xem co user nao moi dang nhap vao hay khong
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });
    this.state.presenceRef.on("child_added", (snap) => {
      //khi co 1 user dang nhap vao thi no se kieu tra xem 2 user do co trung nhau khong
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });
    this.state.presenceRef.on("child_removed", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };
  addStatusToUser = (userId, connected = true) => {
    //Kiem tra xem user vua dang nhap co nam trong list user hay khogn ?
    const updateUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updateUsers });
  };
  isUserOnline = (user) => user.status === "online";
  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };
  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };
  setActiveChannel = (userId) => {
    this.setState({ activeChannel: userId });
  };
  render() {
    const { users, activeChannel } = this.state;
    return (
      <Menu.Menu>
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>
          ({users.length})
        </Menu.Item>
        {users.map((user) => (
          <Menu.Item
            active={user.uid === activeChannel}
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @{user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}
export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
);
