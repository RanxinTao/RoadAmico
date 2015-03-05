'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var emails = require('../../components/emails');
var User = require('../user/user.model');

var MessageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  time: String,
  message: String,
  read: Boolean,
  notification: Boolean
});
MessageSchema.plugin(require('mongoose-lifecycle'));

MessageSchema.methods = {
  getUsers: function (cb) {
    var _this = this;
    User.findById((this.to._id || this.to), function (err, toUser) {
      if (err) return cb(err);

      if (_this.notification) {
        cb(null, {
          to:   toUser
        });
      } else {
        User.findById((_this.from._id || _this.from), function (err, fromUser) {
          if (err) return cb(err);
          cb(null, {
            to: toUser,
            from: fromUser
          });
        });
      }
    });
  }
};

var model = mongoose.model('Message', MessageSchema);

model.on('afterInsert', function (doc) {
  doc.getUsers(function (err, users) {
    if (doc.notification) {
      emails({
        user: users.to,
        name: 'notification',
        view: {
          message: doc.message
        }
      });
    } else {
      emails({
        user: users.to,
        name: 'message',
        view:{
          message: doc.message,
          name: users.from.name
        }
      });
    }
  });
});

module.exports = model;
