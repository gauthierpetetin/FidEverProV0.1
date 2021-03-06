import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
//import firebase from 'firebase/app';
//import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth) {
    console.log('Open-Close authentification provider constructor');

  }

  setLanguage(language: string) {
    this.afAuth.auth.languageCode = language;
  }

  getUserID() {
    console.log('getUserID');
    var user = this.afAuth.auth.currentUser;
    if (user) {
      return user.uid;
    }
    else{
      return 'error';
    }
  }

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    console.log('loginUser');
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  resetPassword(email: string): Promise<any> {
    console.log('resetPassword');
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<any> {
    console.log('logoutUser');
    return this.afAuth.auth.signOut();
  }

  signupUser(newEmail: string, newPassword: string): Promise<any> {
    console.log('signupUser');
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
  }

  setNewEmail(newEmail: string): Promise<any> {
    console.log('setNewEmail');
    return this.afAuth.auth.currentUser.updateEmail(newEmail);
  }

  setProfile(newName: string, newProfilePicture: string): Promise<any> {
    console.log('setNewProfile');
    return this.afAuth.auth.currentUser.updateProfile({
      displayName: newName,
      photoURL: newProfilePicture
    });
  }

  setNewPassword(newPassword: string): Promise<any> {
    console.log('setNewPassword');
    return this.afAuth.auth.currentUser.updatePassword(newPassword);
  }

}
