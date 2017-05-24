import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

/*
  Generated class for the LocationTracker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationTracker {

  public watch:any;
  public lat:number = 0;
  public lng:number = 0;

  constructor(public zone: NgZone, private backgroundGeolocation: BackgroundGeolocation, private geolocation: Geolocation) {
    console.log('Hello LocationTracker Provider');
  }

  startTracking() {

    // Tracking cuando la app esté en segundo plano
    let config:any = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location)=>{
      console.log('BackgroundGeolocation: ' + location.latitude + ' ' + location.longitude);

      // Actualiza la NgZone
      this.zone.run(()=>{
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
    }, (error)=>{
      console.error(error);
    });

    // Encender la geolocalizacion
    this.backgroundGeolocation.start();

    // Tracking cuando la app esté en primer plano
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position:Geoposition)=>{
      console.log(position);
      // Actualiza la NgZone
      this.zone.run(()=>{
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    });
  }

  stopTracking() {
    alert('Stop Tracking');
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }
}
