import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor( private toastController: ToastController ) { }

  async showMessage(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 3000,
      position: 'bottom',
      color: 'light',
      cssClass:"toastCustomStyle",
      animated: true,
      // header: 'hola'
    });
    toast.present();
  }
}
