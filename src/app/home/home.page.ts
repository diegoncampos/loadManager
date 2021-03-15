import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NotificationsService } from '../services/notifications.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public time: any;
  public data: any = {
    presses: [
      { name: "Press 1", maxTons: 25, loadedTons: 0 },
      { name: "Press 2", maxTons: 0, loadedTons: 0 },
      { name: "Press 3", maxTons: 0, loadedTons: 0 },
      { name: "Press 4", maxTons: 0, loadedTons: 0 },
      { name: "Press 5", maxTons: 0, loadedTons: 0 },
      { name: "Press 6", maxTons: 0, loadedTons: 0 },
      { name: "Press 7", maxTons: 0, loadedTons: 0 }
    ],
    bins: [
      {name: "Bin A", tons: null, send: null, sendingTo: "", tonsLeft: null, canLoad: false},
      {name: "Bin B", tons: null, send: null, sendingTo: "", tonsLeft: null, canLoad: false}
    ]
  };

  constructor(
    private notificationsService: NotificationsService,
    public alertController: AlertController,
    ) {
    this.getCurrentDate();
  }

  getCurrentDate() {
    setInterval(() => {
    this.time = new Date();
   }, 1000);
  }

  load(bin) {
    let press = this.data.presses.find((press) => press.name == bin.sendingTo.name);

    press.loadedTons = press.loadedTons + bin.send;
    bin.tonsLeft = bin.tonsLeft? bin.tonsLeft - bin.send : bin.tons - bin.send;
    bin.send = null;
    bin.canLoad = false;
  }

  check(bin) {
    let press = this.data.presses.find((press) => press.name == bin.sendingTo.name);
    console.log("Left:", press.maxTons - press.loadedTons)
    let tonsLeftOnPress = press.maxTons - press.loadedTons;
    console.log(bin.tonsLeft)
    if(bin.tonsLeft ? bin.tonsLeft >= bin.send : bin.tons >= bin.send) {
      if(tonsLeftOnPress < bin.send) {
        this.checkMessage(press, bin);
      }
      else {
        bin.canLoad = true;
      }
    }
    else {
      this.notificationsService.showMessage("Tons to send exede Total Tons Received")
    }
  }

  async checkMessage(pressInfo, bin) {
    const alert = await this.alertController.create({
      cssClass: 'modalStyle',
      header: 'Max tons exceeded on ' + pressInfo.name,
      subHeader: 'Are you shure you want to send anyway?',
      message: 'Space left on '+ pressInfo.name + ': ' + '<b>' + (pressInfo.maxTons - pressInfo.loadedTons) + '</b>',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            console.log("OK")
            bin.canLoad = true;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          }
        }
      ]
    });
    return await alert.present();
  }

  dataChanged(bin) {
    bin.canLoad = false;
  }

  cleanPress(press) {
    press.loadedTons = 0;
  }

  cleanBin(bin) {
    bin.tons = null;
    bin.send = null;
    bin.sendingTo = "";
    bin.tonsLeft = null;
    bin.canLoad = false;
  }

}
