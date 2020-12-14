import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {IndexComponent} from '../index/index.component';
import * as XLSX from 'xlsx';
import {SESSION_STORAGE, StorageService} from 'ngx-webstorage-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  @ViewChild(IndexComponent) index!: IndexComponent;
  
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  public checked:any= [
    {name:"Title", value:true},
    {name:"Subtitle", value:true},
    {name:"Isbn13", value:true},
    {name:"Price", value:true},
    {name:"URL", value:true}
  ];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.checked.forEach((element: any) => {
      let check = this.storage.get(element.name);
      
      if(check === void 0){
        
      }else{
        element.value = this.storage.get(element.name);
        console.log(element.value)
      }
      
    });
  }

  saveInLocal(): void {
    //console.log('recieved= key:' + key + 'value:' + val);
    this.checked.forEach((element: any) => {
      this.storage.set(element.name, element.value);
      console.log(element.name);
    });
    
    //this.data[key]= this.storage.get(key);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit (){
    
  }

  showOptions(event:any, position:any, name:any): void{
    console.log(this.checked[position])
    this.checked[position].value = this.checked[position].value ? false : true;
    
    this.index.columns[position].hide = this.checked[position].value ? false : true;
  }

  exportAsExcel(){
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.index.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'ExportTable.xlsx');
  }
}
