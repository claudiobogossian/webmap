import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';

/**
 *  import terrabrasilis api from node_modules
 */
import * as Terrabrasilis from 'terrabrasilis-api';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Layer } from '../../entity/layer';
import { Utils } from '../../util/utils';
import { LocalStorageService } from '../../services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { get } from 'lodash'

import { Store, select } from "@ngrx/store";
import * as fromLayerFilterReducer from "../../redux/reducers/layer-filter-reducer";
import { Observable } from "rxjs";


@Component({
  selector: 'app-terrabrasilis-api',
  template: ``
})
export class TerrabrasilisApiComponent implements OnInit {
  /**
   * Terrabrasilis API module
   */
  private Terrabrasilis: any = Terrabrasilis;
  filters: Observable<fromLayerFilterReducer.Filter[]>;

  constructor(
    private dialog: MatDialog
    , private dom: DomSanitizer
    , private cdRef: ChangeDetectorRef
    , private localStorageService: LocalStorageService
    , private _translate: TranslateService = null
    , private _snackBar: MatSnackBar = null
    , private store: Store<fromLayerFilterReducer.State>
  ) {
    if(this.store) {
      this.store
      .pipe(select((state: any) => state.layerFilter.filters))
      .subscribe((refreshedFilter) => {
        this.filters = refreshedFilter;
        this.applyFiltersOnLayer(this.filters)
      });
    }
  }

  applyFiltersOnLayer (filters) {
    Terrabrasilis.filterLayers(filters)
    console.log('[TERRA-API] filters: ', filters)
  }

  ////////////////////////////////////////////////
  //// Angular life cycle hooks
  ////////////////////////////////////////////////
  ngOnInit() { }

  ////////////////////////////////////////////////
  //// MapBuilder
  ////////////////////////////////////////////////
  public map(points: any, baselayers: any, overlayers: any): void {
    Terrabrasilis.map(points.longitude, points.latitude)
      .addCustomizedBaseLayers(JSON.parse(JSON.stringify(baselayers)))
      .addCustomizedOverLayers(JSON.parse(JSON.stringify(overlayers)))
      // .addBaseLayers(JSON.parse(JSON.stringify(this.baselayers)))
      // .addOverLayers(JSON.parse(JSON.stringify(this.overlayers)))
      // .enableLegendAndToolToLayers()
      .enableZoomBox()
      // .enableDrawFeatureTool()
      .enableLayersControlTool()
      .enableScaleControlTool()
      .enableDisplayMouseCoordinates()
      // .enableInvalidateSize()
      .hideStandardLayerControl()
      .enableGeocodingTool();
  }

  ////////////////////////////////////////////////
  //// Layers interactions
  ////////////////////////////////////////////////
  layerOpacity(layerObject: any, event: any) {
    this.Terrabrasilis.setOpacityToLayer(layerObject, (event.value));
  }

  ////////////////////////////////////////////////
  //// Sidebar header tools
  ////////////////////////////////////////////////
  fullScreen() {
    Terrabrasilis.fullScreen();
  }

  drawSimpleShape() {
    this.showDialog('Terrabrasilis web application.');
  }

  resetMap() {
    Terrabrasilis.resetMap();
  }

  undo() {
    Terrabrasilis.undo();
  }

  redo() {
    Terrabrasilis.redo();
  }

  attachGeometryDrawingListener(listener:any) {
    Terrabrasilis.enableDrawFeatureTool(listener);
  }

  detachGeometryDrawingListener() {
    Terrabrasilis.disableDrawFeatureTool();
  }

  getFeatureInfo(event: any) {
    Terrabrasilis.addGetLayerFeatureInfoEventToMap(event);
  }

  showCoordinates(event: any) {
    Terrabrasilis.addShowCoordinatesEventToMap(event);
  }

  ////////////////////////////////////////////////
  //// Components
  ////////////////////////////////////////////////
  download(layer: Layer) {
    let download = '';
    let downloadBtn = this._translate.instant('dialog.downloadBtn');
    let metadataBtn = this._translate.instant('dialog.metadataBtn');
    const lang = this._translate.currentLang;

    layer.downloads.forEach((d: any) => {
      if(d.lang==lang) {

        download += '<div>' +
                    '  <h5 class="card-title">' + d.category + '</h5>' +
                    '  <p class="card-text">' + d.description + '</p>' +
                    '  <a target="_blank" href="' + d.metadata + '" class="btn btn-primary btn-success">'+metadataBtn+'</a>'+
                    '  <a href="' + d.link + '" class="btn btn-primary btn-success">'+downloadBtn+'</a>'+
                    '</div>';
      }
    });

    const html =
      '<div class="container">' +
      '    <div class="card">' +
      '        <div class="card-body">' + download +
      '        </div>' +
      '    </div>' +
      '</div>';
    this.showDialog(html);
  }

  

  getLegend(layer: any, urlOrCompleteSrcImgElement: boolean): Promise<any> {

    return this.localStorageService.getValue('translate').toPromise()
      .then((item: any) => {
        let language = 'pt-br';
        if(JSON.parse(item)!=null)
        {
          language = get(JSON.parse(item), 'value')
        }
        
        return Utils.getLegend(layer, urlOrCompleteSrcImgElement, language)
      });
  }

  getBasicLayerInfo(layerObject: any) {
    this.cdRef.detectChanges();

    console.log(layerObject);

    const match = /gwc\/service\/wms/;

    const source = layerObject.datasource != null ?
      (match.test(layerObject.datasource.host) == true ?
        layerObject.datasource.host.replace('gwc/service/wms', 'ows') : layerObject.datasource.host) :
      layerObject.thirdHost;

    const layerBasicInfo = {
      title: layerObject.title,
      layer: layerObject.name,
      workspace: layerObject.workspace,
      source
    };

    const infoTable = '<table class="table-responsive table "><tr class="table-active"><th colspan="3">' + layerBasicInfo.title + '</th></tr>'
      + ' <tr> <td><b>Layer</b></td><td colspan="2">' + layerBasicInfo.layer + '</td></tr>'
      + '<tr><td><b>Workspace</b></td><td colspan="2">' + layerBasicInfo.workspace + '</td></tr>'
      + '<tr><td><b>Source</b></td><td colspan="2">' + layerBasicInfo.source + '</td></tr></table>';

    this.showDialog(infoTable);
  }

  ////////////////////////////////////////////////
  //// General tools
  ////////////////////////////////////////////////
  enableLoading(dom?: string): void {
    Terrabrasilis.enableLoading(dom);
  }

  disableLoading(dom?: string): void {
    Terrabrasilis.disableLoading(dom);
  }

  reorderOverLayers(layers: any): void {
    Terrabrasilis.reorderOverLayers(layers);
  }

  getTerrabrasilisBaselayers(): any {
    return Terrabrasilis.getTerrabrasilisBaselayers();
  }

  deactiveLayer(layer: any): void {
    Terrabrasilis.deactiveLayer(layer);
  }

  activeLayer(layer: any): void {
    Terrabrasilis.activeLayer(layer);
  }

  isLayerActived(layer: any): boolean {
    return Terrabrasilis.isLayerActived(layer);
  }

  getLayerByName(layerName: string): any {
    return Terrabrasilis.getLayerByName(layerName);
  }

  addGetLayerFeatureInfoEventToMap(event: any): void {
    Terrabrasilis.addGetLayerFeatureInfoEventToMap(event);
  }

  addShowCoordinatesEventToMap(event: any): void {
    Terrabrasilis.addShowCoordinatesEventToMap(event);
  }

  moveLayerToBack(layer: any): void {
    Terrabrasilis.moveLayerToBack(layer);
  }

  moveLayerToFront(layer: any) {
    Terrabrasilis.moveLayerToFront(layer);
  }

  ////////////////////////////////////////////////
  //// General use dialog
  ////////////////////////////////////////////////
  showDialog(content: string): void {
    const dialogRef = this.dialog.open(DialogComponent, { width: '450px' });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(content);
  }

  /**
   * Enable or disable TimeDimension tool for one layer.
   * @param layer A layer with time dimension available.
   */
  onOffTimeDimension(layer: Layer) {
    // verify if layer is raster or vector type and use it to set aggregate times value.
    Terrabrasilis.onOffTimeDimension(layer.workspace+':'+layer.name, layer.isAggregatable /*aggregateTimes*/);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  fitBounds(layer: Layer) {
    const self = this
    this.enableLoading();
    Terrabrasilis.fitBounds(layer).then(console.log)
      .catch(() => {
        self.openSnackBar('Ops, esta layer não tem os atributos necessários pra fazer o zoom', 'Aviso')
        self.disableLoading()
      })
      .finally(()=>{self.disableLoading();});
  }

  getDimensions(layer: Layer) {
    return Terrabrasilis.getDimensions(layer)
  }


  updateLayers(appLayers)
  {
    Terrabrasilis.updateLayers(JSON.parse(JSON.stringify(appLayers)));
  }

  ////////////////////////////////////////////////
  //// Private methods
  ////////////////////////////////////////////////
}
