import {Component, OnInit} from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

import {DataService} from "../data.service";
import {Sticker} from "../sticker";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf-container',
  templateUrl: './pdf-container.component.html',
  styleUrls: ['./pdf-container.component.scss']
})
export class PdfContainerComponent implements OnInit {

  pdfUrl: string;

  // A4: [210, 297]
  // A4: [595.28, 841.89]

  // 1mm = 2,8px
  // 16mm x 10mm

  // 12 x 29

  constructor(private dataService: DataService) {
    pdfMake.sizes
  }

  ngOnInit() {
    this.dataService.currentModel.subscribe(model => this.onDocumentFormChange(model))

    this.updatePdfDocument(new Sticker("Name", 10, 10, 10));
  }

  onDocumentFormChange(model) {
    console.log("hello", model);
    this.updatePdfDocument(model);
  }

  updatePdfDocument(model: Sticker) {
    var mmToPxRatio = 2.83466667;
    var ptToMmRatio = 0.352777778;

    var columns = 12;
    var rows = 29;

    var pageWidth = 595.28;
    var contentWidth = pageWidth - 2 * mmToPxRatio * 2.5;
    var columnWidth = contentWidth / columns - 3 * ptToMmRatio;

    let topRowHeight = 3 * mmToPxRatio;
    let bottomRowHeight = 7 * mmToPxRatio;

    let tableBuilder = new TableBuilder(12, 29);

    tableBuilder.addCell({
      table: {
        heights: [topRowHeight, bottomRowHeight],
        widths: [columnWidth / 2, columnWidth / 2],
        body: [
          [
            {
              text: model.name,
              colSpan: 2,
              fontSize: 8,
              alignment: 'center'
            },
            {}
          ],
          [{}, {}]
        ]
      },
      layout: 'noBorders'
    });

    for (let i = 0; i < model.amount; i++) {
      tableBuilder.addCell({
        table: {
          heights: [topRowHeight, bottomRowHeight],
          widths: ['*', '*'],
          body: [
            [
              {
                text: model.price + ' zł',
                fontSize: 8,
                decoration: 'lineThrough',
                // fillColor: 'red',
                alignment: 'center'
              },
              {
                text: model.discount + '%',
                fontSize: 8,
                // fillColor: 'green',
                alignment: 'center'
              }
            ],
            [
              {
                text: this.calculatePriceAfterDiscount(model.price, model.discount) + ' zł',
                colSpan: 2,
                fontSize: 12,
                bold: true,
                // fillColor: 'blue',
                alignment: 'center',
                margin: [0, 2, 0, 0]
              },
              {}
            ]
          ]
        },
        margin: 0,
        // fillColor: 'yellow',
        layout: 'noBorders'
      });
    }

    var widths = [];

    for (var i = 0; i < columns; i++) {
      widths.push(columnWidth);
    }

    var docDefinition = {
      pageSize: 'A4',
      pageMargins: mmToPxRatio * 2.5,
      defaultStyle: {
        margin: 0
      },
      content: [{
        table: {
          heights: topRowHeight + bottomRowHeight,
          widths: widths,
          body: tableBuilder.buildTable(),
          margin: 0
        },
        layout: {
          hLineWidth: function (i, node) {
            return 1;
          },
          vLineWidth: function (i, node) {
            return 1;
          },
          paddingLeft: function (i, node) {
            return 0;
          },
          paddingRight: function (i, node) {
            return 0;
          },
          paddingTop: function (i, node) {
            return 0;
          },
          paddingBottom: function (i, node) {
            return 0;
          },
        }
      }]
    };

    // console.log(docDefinition);

    pdfMake.createPdf(docDefinition).getDataUrl((outDoc) => {
      // document.getElementById('pdfV')[0].src = outDoc;
      // console.log("setting", outDoc);
      this.pdfUrl = outDoc;
    });
  }

  calculatePriceAfterDiscount(price: number, discount: number) {
    return price - (price * discount / 100);
  }
}

class TableBuilder {
  content;
  cells;

  columns: number;
  rows: number;

  constructor(columns: number, rows: number) {
    this.cells = [];
    this.columns = columns;
    this.rows = rows;
    this.content = new Array(rows).fill({}).map(() => Array(columns).fill({}));
  }

  addCell(cell) {
    this.cells.push(cell);
  }

  buildTable() {
    let colIndex = 0;
    let rowIndex = 0;
    for (let i = 0; i < this.cells.length; i++) {
      this.content[rowIndex][colIndex] = this.cells[i];

      colIndex++;
      if (colIndex >= this.columns) {
        colIndex = 0;
        rowIndex++;
      }
    }

    return this.content;
  }
}
