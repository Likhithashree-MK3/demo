import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { LoginPage } from '../login/login';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

  ProfileSegment: string = "Profile";
  OldPassword: string = "";
  NewPassword: string = "";
  ConfirmPassword: string = "";
  LastProfilePhoto: any;
  isProfilePhotoChange: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public httpClient: HttpClient,
    public global: GlobalProvider) {

    this.global.HeaderTitle = this.global.UserDetails[0].Name;

  }

  UpdatePasswordClick(OldPassword, NewPassword, ConfirmPassword) {

    if (OldPassword != "" && NewPassword != "" && ConfirmPassword != "") {

      if (OldPassword == this.global.UserDetails[0].Password) {

        if (NewPassword == ConfirmPassword) {

          if (OldPassword != NewPassword) {

            //if (this.global.IsValid("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", NewPassword)) {

            if (this.global.IsValid(NewPassword)) {

              if (this.global.CheckInternetConnection()) {

                this.global.LoadingShow("Please wait...");

                this.httpClient.post<any>(this.global.HostedPath + "UpdatePassword?Username=" + this.global.UserDetails[0].Username + "&NewPassword=" + ConfirmPassword, {}).subscribe(loginDetails => {

                  this.global.LoadingHide();

                  if (loginDetails.StatusCode == 200) {

                    this.global.ToastShow("Password Updated Successfully, Please login again with new Password");
                    this.navCtrl.setRoot(LoginPage);
                    localStorage.clear();

                  }
                  else {
                    console.log(loginDetails);
                    this.global.ToastShow("Something went wrong, Pls try again later");
                    this.global.LoadingHide();
                  }


                }, (error) => {
                  console.log(error);
                  this.global.LoadingHide();
                });

              }
              else {
                this.global.ToastShow(this.global.NetworkMessage);
              }

            }
            else {
              //this.global.ToastShow("Password must contain atleast 8 characters, one special character, one numberic and one capital letter");
            }

          }
          else {
            this.global.ToastShow("New password can not be old password");
          }

        }
        else {
          this.global.ToastShow("New Password and Confirm Password is not matching");
        }

      }
      else {
        this.global.ToastShow("Old Password is not matching");
      }

    }
    else {
      this.global.ToastShow("Please enter all the fields");
    }

  }

  ProfilePhotoClick() {

    const actionSheet = this.actionSheetCtrl.create({
      title: 'Add Photo',
      buttons: [
        {
          text: 'Capture Photo',
          handler: () => {
            this.isProfilePhotoChange = true;
            this.CameraClick(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            this.isProfilePhotoChange = true;
            this.CameraClick(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: "cancel",
          handler: () => {
          }
        },
      ]
    });
    actionSheet.present();

  }

  CameraClick(sourceType) {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {

      this.LastProfilePhoto = this.dataURItoBlob("data:image/jpeg;base64," + imageData);

      this.global.UserDetails[0].ProfilePhotoPath = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {

      this.isProfilePhotoChange = false;
      this.global.ToastShow(err)

    });

  }

  ProfilePhototUpdateClick() {

    var formData = new FormData();

    formData.append("Photo", this.LastProfilePhoto);

    this.httpClient.post(this.global.HostedPath + 'UploadFile?EmpCode=' + this.global.UserDetails[0].Code, formData).subscribe(imageUploadData => {

      console.log(imageUploadData);

      this.global.ToastShow("Your profile phtot updated successfully");

    }, error => {

      console.log(error);

      this.global.ToastShow("Failed to-upload attachments");

    });

  }

  dataURItoBlob(dataURI) {

    // alert(dataURI);
    // alert(dataURI.split(',')[1]);
    var byteString = atob(dataURI.split(',')[1]);
    //  alert(byteString);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // alert(mimeString)
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { "type": mimeString });

    return bb;

  }

}
