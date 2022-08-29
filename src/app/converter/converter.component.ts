import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";
import { DataFrame, range } from 'data-forge'
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {
  showdata: boolean
  sheet_arraydata: any[] = []
  df: any
  file: any
  getXaxistype: any[] = []
  groupparamsID: string = ""
  keysdata: string[] = []
  trimmed_data: any
  ChartCount:any=[]
  count:number=0;
  users_dataframe: any[] = []
  FormsData:any;
  submitted:boolean = false
  myChart:any

  constructor() {
    this.showdata = false
  }
  ngOnInit(): void { 
  }

  reset() { 
    this.chartinit=0
   window.location.reload()
  }
  
  getCol(fdata:any){
  let Getcolumn:any;       
    for (let i = 0; i < Object.keys(fdata).length; i++) {
      if (Object.keys(fdata)[i] == 'groupparam') {
        console.log("groupby_param (y axis)");
        Getcolumn = Object.values<any>(fdata)[i];
      }
    }
    return Getcolumn;
  }
  
  getXaxisData(formValue:any){
    let x_axis_data;
    for (let i = 0; i < Object.keys(formValue).length; i++) {
      if (Object.values(formValue)[i] == true) {
        console.log("selected X axis");
        x_axis_data=(Object.keys(formValue)[i]);
      }
    }
    return x_axis_data
  }

axis_selection(x_axis:any,y_axis:any) {
    // this.getByTimeline(y_axis);
    // get x axis
    var yAxisCollection:any[]=[];
    this.keysdata = this.df.deflate((row: any) => row[y_axis]).distinct().toArray();
    //get y axis
    let keysvalue = this.df
      .groupBy((row: any) => row[y_axis])
      .select((group: any) => ({
        [x_axis]: group.deflate((row: any) => row[x_axis]).sum(),
      }))
      .inflate();
      var summmarized_array = keysvalue.toArray();
      summmarized_array.map((e: any) => {
        yAxisCollection.push(e[x_axis])
       })
    return yAxisCollection;
  }
  ChartTypesArray:string[]=['line', 'bar', 'radar', 'doughnut' ,'pie' , 'bubble', 'scatter',]
  chartinit:any=0
  onSubmit(excelForm: any): void {
    this.submitted=true
     this.FormsData = excelForm.form.value;
    let x_axis_label= this.getXaxisData(this.FormsData);
    // get selected key
    let y_axis_label = this.getCol(this.FormsData);
    let axisData = this.axis_selection(x_axis_label,y_axis_label);
    if(this.chartinit<1) {
      this.chartinit=1;
      this.initchart(this.keysdata,axisData,this.FormsData.ChartName,'myChart0',y_axis_label,y_axis_label,x_axis_label)
  }else{
      this.myChart.data.labels=this.keysdata;
      this.myChart.data.datasets[0].data=axisData;
      this.myChart.config.type=this.FormsData.ChartName
      this.myChart.data.datasets[0].label=y_axis_label;
      this.myChart.config.options.scales.yAxes[0].scaleLabel.labelString= x_axis_label
      this.myChart.config.options.scales.xAxes[0].scaleLabel.labelString= y_axis_label
      this.myChart.update('none');
    }
  }
 
  // excel to json
     obj_converter(event:any){
       return new Promise((resolve,reject)=>{
        const selectedFile = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
          fileReader.onload = (event: any) => {
            let binaryData = event.target.result;
            let workbook = XLSX.read(binaryData, { type: 'binary' });
              workbook.SheetNames.forEach(sheet => {
              this.sheet_arraydata = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
                blankrows: false,
                raw: true,
                rawNumbers: true
              });
              if (this.sheet_arraydata.length<0) return reject("no data found") 
            })
            resolve(this.sheet_arraydata);
          }
    })
      
  }
  ColoumlType:any[]=[]
  getColumnTypes(dfdata:any){
   let Type = dfdata.detectTypes().toArray()
     const types = Type.filter((e:any)=> {
       if(e.Type=="number") return this.ColoumlType.push(e.Column);
       else return;
      });
    return this.ColoumlType;
  }
 async onFileSelected(event: any) {
  this.getXaxistype.length=0

    const replaceKeys = (object: any) => {
    Object.keys(object).forEach(function (key) {
      const removeSpace = key.trim();
      const newKey = removeSpace.toString();
      if (object[key] && typeof object[key] === 'object') {
        replaceKeys(object[key]);//recursion
      }
      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
      }
    });
    return object;
  }
  this.obj_converter(event)
  .then((data)=>{
    this.showdata= true;
    this.trimmed_data = replaceKeys(data);
    this.df = new DataFrame(this.trimmed_data);
    this.getXaxistype = this.getColumnTypes(this.df);
    this.groupparamsID = this.df.getColumnNames();
  })
  .catch((e)=>{console.log(e)})
  }
  // get colmn data 
//get data by timeline
  getByTimeline(selected_groupparam:any){
const timelinedData = this.df
// .select((row:any)=>{})
.where((row:any)=>{
row[selected_groupparam] == '2013' 
})
  }
  check(x:any) {
    return x.find((i:any) => (typeof i === "string"));
  }
  fixedInt(x:[any],y:[any]) {
    var xfxd = x.map((e:any)=>Math.floor(e));
    var yfxd = y.map((e:any)=>Math.floor(e));
    var finalfxd=[]
    finalfxd.push([xfxd])
    finalfxd.push([yfxd])
    return finalfxd;
  }
 
  initchart($Xaxis: any,$Yaxis:any,$chart_type:any,$chartName:any,$datalabels:any='default',$Xdatalabels:any,$Ydatalabels:any) {
  // var axisdataFixed = this.fixedInt($Xaxis,$Yaxis);
  console.log('called initchart col');
     this.myChart = new Chart($chartName, {
      type: $chart_type,
      data: {
        labels: $Xaxis,
        datasets:
          [
            {
            label: $datalabels,
            data:$Yaxis,
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          //   // backgroundColor: red,
          },
        ]
      },
      options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: $Xdatalabels
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: $Ydatalabels
              }
            }]
          },
      },
      
    }); 
  }
added:boolean=false;

addDataObject(column:any){
  this.added=true;
  let chartname = 'myChart'+this.ChartCount[this.count];
  // this.initchart(this.keysdata,this.df.getSeries(column.AddCol).toArray(),'bar',chartname,column.AddCol);
}
  scroll(el: HTMLElement) {
    el.scrollIntoView();
}
}
