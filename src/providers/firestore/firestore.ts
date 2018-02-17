import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
//import {PROPERTIES} from './mock-properties';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

//import { AngularFireDatabase } from 'angularfire2/database-deprecated';

// Requis pour le storage
import * as firebase from 'firebase/app';
import 'firebase/storage';

// export interface Coin {
//   coinAmount: number;
//   coinColor: string;
//   coinName: string;
// }


@Injectable()
export class FirestoreProvider {

  afCoinCollection: AngularFirestoreCollection<any>;
  coinCollection: Observable<any[]>;

  afCoinDocument: AngularFirestoreDocument<any>;
  coinDocument: Observable<any[]>;

  configSubscribtion: any; // Subscribed
  configObserver: any;

  configRootPath: string = 'config/api';
  imagesRootPath: string = 'images';
  storage: any;
  storageRef: any;

  constructor(
    public http: Http,
    private angularFirestore: AngularFirestore
  ) {
    console.log('  Open Firestore Provider constructor');

    // Get a reference to the storage service, which is used to create references in your storage bucket
    this.storage = firebase.storage();
    // Create a storage reference from our storage service
    this.storageRef = this.storage.ref(this.imagesRootPath);

  }

  init(): Promise<any> {
    console.log('  Open firestore init()');
    var self = this;
    return new Promise(
      function(resolve, reject) {
        //Unsubscribtion security
        if(self.configSubscribtion){self.configSubscribtion.unsubscribe();console.log('UNSUBSCRIBE CONFIG');}

        self.configObserver = self.getDocument(self.configRootPath);
        self.configSubscribtion = self.configObserver.subscribe((configData) => {
          console.log('SUBSCRIBE CONFIG : ', configData);
          if ( configData ) {
            resolve(configData);
          }
          else {
            reject('Null url');
          }
        });
      });
  }


  getCollection(collectionName : string, orderParameter?: string) {
    if(orderParameter) {
      console.log('  Open firestoreProvider-getcollection with orderParameter : ', orderParameter,'.');
      if(this.angularFirestore.collection<any[]>(collectionName)){
          this.afCoinCollection = this.angularFirestore.collection<any[]>(collectionName, ref => ref
            .orderBy(orderParameter)
          );
      }
      else{
        console.log('Collection does not exist');
        return;
      }
    }
    else {
      console.log('  Open firestoreProvider-getcollection without orderParameter.');
      if(this.angularFirestore.collection<any[]>(collectionName)){
          this.afCoinCollection = this.angularFirestore.collection<any[]>(collectionName);
      }
      else{
        console.log('Collection does not exist');
        return;
      }
    }

    //--------FIRESTORE QUERIES-----------https://github.com/angular/angularfire2/blob/master/docs/firestore/querying-collections.md
    // this.afCoinCollection = this.angularFirestore.collection<any[]>(collectionName, ref => ref
    //   .where(
    //     'coinAmount', '>', 2)
    //   .orderBy('coinAmount', 'desc')
    // );

    this.coinCollection = this.afCoinCollection.snapshotChanges()
      .map(actions => {
        if(!actions) {
          return;
        }
        return actions.map(a => {
          if(a && a.payload.doc.exists) {
            const type = a.type;
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, type, ...data };
          }
          else{
            console.log('ERROR: FIRESTORE NULL COLLECTION : ', collectionName);
            return;
          }

        });
      });

    return this.coinCollection;
  }

  getDocument(documentName : string) {
    console.log('Open firestoreProvider-getDocument');

    if(this.angularFirestore.doc(documentName)){
        this.afCoinDocument = this.angularFirestore.doc(documentName);
    }
    else{
      console.log('Document does not exist');
      return;
    }

    this.coinDocument = this.afCoinDocument.snapshotChanges()
      .map(a => {
        if(a && a.payload.exists) {
          const type = a.type;
          const data = a.payload.data() as any;
          const id = a.payload.id;
          return { id, type, ...data };
        }
        else{
          console.log('ERROR: FIRESTORE NULL DOCUMENT : ', documentName);
          return;
        }

    });

    return this.coinDocument;
  }

  setDocInCollection(coin : any, collectionName : string){
    console.log('  Open firestoreProvider-setdocument');

    this.afCoinCollection = this.angularFirestore.collection<any>(collectionName);

    return Observable.create(observer => {
      observer.next(this.afCoinCollection.add(coin));
      observer.complete();
    });

  }

  deleteDocFromCollection(docID : string, collectionName : string) {
    console.log('delete document '.concat(docID,' from collection ',collectionName));
    this.afCoinCollection = this.angularFirestore.collection<any[]>(collectionName);
    this.afCoinCollection.doc(docID).delete().then( resp => {
      console.log("Document successfully deleted!");
    }).catch( error => {
      console.error("Error removing document: ", error);
    });
  }


  downloadImageAtPath(myImagePath : string): Promise<any> {
    console.log('  Open downloadImageAtPath : '.concat(myImagePath));
    // Create a reference to the file we want to download
    var imageStorageRef = this.storageRef.child(myImagePath) //Example: 'images/space.jpg'
    // Get the download URL
    return imageStorageRef.getDownloadURL();
  }


  updateDocFromCollectionWithContent(docID : string, collectionName : string, newContent : any) {
    console.log('  Open update document '.concat(docID,' from collection ',collectionName));
    this.afCoinCollection = this.angularFirestore.collection<any[]>(collectionName);
    this.afCoinCollection.doc(docID).update(newContent);
  }


  // destination = 'images/uploaded.png'
  uploadImage(imageURIData: string, destination: string): Promise<any> {
    console.log('Open uploadImage : ', imageURIData, ' at : ', destination);

    // let selectedImage  = this.dataURItoBlob('data:image/jpeg;base64,' + imageURIData);
    // var imageBlob = new Blob([success], { type: "image/jpeg" });

    // console.log('Selected image : ', selectedImage);

    var self = this;
    return new Promise(
      function(resolve, reject) {
        if (imageURIData) {
          console.log('Put storage');
          self.storageRef.child(destination).putString(imageURIData, 'base64', { contentType: 'image/png' }).then( (snapshot) => {
            resolve(snapshot.downloadURL);
          }).catch( (err) => {
            reject(err);
          });
        }
        else{
          reject('Null');
        }
      }
    );
  }


  dataURItoBlob(dataURI) {
    console.log('Open dataURItoBlob');
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };


}
