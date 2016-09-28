var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Status = React.createClass({
	handlePost: function(){
		var postData = {
			user_id: firebase.auth().currentUser.uid,
			body: this.refs.body.value,
			created_at: firebase.database.ServerValue.TIMESTAMP
		};

		var postRefKey = firebase.database().ref().child('posts').push().key;
		firebase.database().ref('posts/' + postRefKey).set(postData);
		firebase.database().ref('/user-posts/' + firebase.auth().currentUser.uid + '/' + postRefKey).set(postData);

		hashHistory.push("/");
	},

	handleKeyPress: function(e){
		if(e.key == 'Enter'){
			try{
				this.handlePost();
			}
			catch(e){};
		}
	},

	render: function(){
		var postArray = [];
		var recentPostsRef = firebase.database().ref().child('posts');
		recentPostsRef.on("child_added", snap => {
			var post = snap.val();
			console.log(post.body);
			postArray.push(post);
		});

		return (
			<div>
				<h1>Connection Feed</h1>
				<input type="text" ref="body" placeholder="What are you thinking about?" onKeyPress={this.handleKeyPress} className="form-control"/><br />
				<center><button className="btn btn-primary" onClick={this.handlePost}>Post</button></center><br />	
				{postArray.map((post,index) => (
        			<li key={index}>{post.user_id} => {post.body} @ {post.created_at}</li>
   				))}
			</div>
		);
	}
});

module.exports = Status;