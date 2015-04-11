
var mustache = require('mustache');
var Q = require('q');
var moment = require('moment');
var config = require('../../config/environment');
var translate = require('../translate');
var templateLoader = require('./templateLoader');
var language = require('../translate/language');
//var Message = require('../../api/old/message/message.model');
var User = require('../../api/user/user.model');

var api;
api = {

  /**
   * A soft communication is notifying the user of a non time-critical event, such as somebody following them or having
   * their account verified. This creates a notification, but checks the user's settings before sending emails.
   */
  soft: function (data) {

    if (!data.to._id) {
      console.error('User not provided')
    }
    // Create a notification
    Message.create({
      to: data.to._id,
      notification: true,
      time: moment().toISOString(),
      message: data.message
    });

    // Send an email checking preferences
    if (data.to.emailPrefs.soft) {
      data.view = data.view || {message: data.message};
      data.user = data.to;
      api.email(data.name || 'notification', data)
    }
  },

  /**
   * A hard communication is notifying the user of a time-critical event, such as somebody booking or canceling a time
   * slot. This creates a notification and always sends an email.
   */
  hard: function (data) {

    var to = data.to._id || data.to;
    if (!to) {
      console.error('Cannot hard notify. No \'to\' field');
    } else {

      // Create a notification
      Message.create({
        to: to,
        notification: true,
        time: moment().toISOString(),
        message: data.message
      });

      // Send an email
      data.view = data.view || { message: data.message };
      if (data.to.email) {
        data.user = data.to;
        api.email(data.name || 'notification', data)
      } else {
        User.findById(data.to, function (err, user) {
          if (err) return;
          data.user = user;
          api.email(data.name || 'notification', data)
        });
      }
    }

  },

  /**
   * When a user messages another, then it will not create a notification, but a message. Also can send an email
   * according to the user's preferences.
   */
  message: function (data) {

    var deferred = Q.defer();

    //var to = data.to._id || data.to;
    //var from = (data.from && data.from._id) || data.from || (data.req && data.req.user && data.req.user._id);

    //if (!to || !from) {
    //  deferred.reject({message: 'Invalid message'}); // TODO: Translate this
    //} else {

    Message.create({
      to: data.to,
      from: data.from._id,
      time: moment().toISOString(),
      message: data.message
    }, function (err, data) {
      if (err) return deferred.reject(err);

      Message.populate(data, [
        {path: 'to', select: 'name photo'},
        {path: 'from', select: 'name photo'}
      ], function (err, message) {
        if (err) return deferred.reject(err);

        User.findById(data.to, function (err, user) {
          if (err) return deferred.reject(err);

          if (user.emailPrefs.messages) {
            data.user = user;
            data.view = {
              name: data.from.name,
              message: data.message
            };
            api.email('message', data);
          }

          deferred.resolve(message);
        });
      });
    });
    //}

    return deferred.promise;
  },

  /**
   * Only sends an email. No notification
   */
  email: function (name, data) {

  }
};

module.exports = api;
