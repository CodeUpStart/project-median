Stories = new Mongo.Collection("stories");

if (Meteor.isClient) {
  Template.registerHelper('userAvatar', function() {
    return Meteor.user().services.twitter.profile_image_url;
  });

  Template.registerHelper('formatDate', function(date) {
    return moment(date).startOf('hour').fromNow();
  });

  Template.body.helpers({
    stories: function() {
      return Stories.find({}, {
        sort: {
          createdAt: -1
        }
      });
    }
  });

  Template.body.events({
    "submit .new-story": function(event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form elements
      var text = event.target.text.value;
      var title = event.target.title.value;

      // Make sure the user is logged in before inserting a task
      if (!Meteor.userId()) {
        throw new Meteor.Error("Not Authorized");
      }

      // Insert a task into the collection
      Stories.insert({
        text: text,
        title: title,
        createdAt: new Date(), // current time
        owner: Meteor.userId(), // id of logged in user
        username: Meteor.user().username,
        authorAvatar: Meteor.user().services.twitter.profile_image_url,
        authorName: Meteor.user().services.twitter.screenName
      });

      // Clear form
      event.target.text.value = "";
      event.target.title.value = "";
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
}
