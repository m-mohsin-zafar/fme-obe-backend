//@ts-nocheck
export function createTranscriptTemplate(data, logo, signature) {
  const commulative = {};

  function yesNo(string) {
    if (string) return string.charAt(0).toUpperCase();
    else return '-';
  }

  function passFail(val, cat = 1) {
    let result = 'F';
    if (cat === 1) {
      if (val >= 0.5) {
        result = 'P';
      }
    } else {
      if (val > 0) {
        result = 'P';
      }
    }
    return result;
  }

  function count_semester(a, count, PLO) {
    if (a != '-') {
      if (PLO in commulative) commulative[PLO][a] = commulative[PLO][a] + 1;
      else if (a == 'Y') commulative[PLO] = { Y: 1, N: 0 };
      else if (a == 'N') commulative[PLO] = { Y: 0, N: 1 };
      if (PLO in count) count[PLO][a] = count[PLO][a] + 1;
      else if (a == 'Y') count[PLO] = { Y: 1, N: 0 };
      else if (a == 'N') count[PLO] = { Y: 0, N: 1 };
    }
    return '';
  }

  function semesterGP(count: any) {
    for (let key in count) {
      let num = parseFloat(
        count[key]['Y'] / (count[key]['Y'] + count[key]['N']),
      );
      count[key]['semester'] = num.toFixed(2);
    }
    return '';
  }

  function commulativePLO() {
    for (let key in commulative) {
      let num = parseFloat(
        commulative[key]['Y'] / (commulative[key]['Y'] + commulative[key]['N']),
      );
      commulative[key]['semester'] = num.toFixed(2);
    }
    return '';
  }

  let studentName = data['name'] ? data['name'] : 'No Name';
  let regNum = data['reg'];
  let faculty = data['faculty'];

  delete data['faculty'];
  delete data['name'];
  delete data['batch'];
  delete data['reg'];
  const details = Object.keys(data['result'])
    .sort()
    .reduce((obj, key) => {
      obj[key] = data['result'][key];
      return obj;
    }, {});

  const rowYear = Object.keys(details)[Object.keys(details).length - 1];
  const rowLast =
    details[Object.keys(details)[Object.keys(details).length - 1]];
  const yearLast = Object.keys(rowLast)[Object.keys(rowLast).length - 1];

  return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
              crossorigin="anonymous"
            />
            
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Poppins:wght@500&display=swap');

                .header > div {
                    text-align: center;
                }

                .giki-logo {
                    max-width: 65%;
                    max-height: 65%;
                    min-width: 50%;
                    min-height: 50%;
                }

                .student-data {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    font-size: 0.8em;
                }

                .title > h2 {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 1.2em;
                    font-weight: bolder;
                }

                .title > h4 {
                    font-family: 'Poppins', sans-serif;
                    font-size: 1em;
                }

                .rowhead {
                    text-align: center;
                    /* border: 1px solid black; */
                }

                .foot {
                    font-size: 0.7em;
                }

                tbody > tr > td {
                    font-size: 0.70em;
                }

                thead > tr > th {
                    font-size: 0.75em;
                }

                .table > :not(caption) > * > * {
                    padding: 0.25rem;
                }

                .w-10 {
                    table-layout: fixed;
                    width: 5em;
                    padding: 0;
                }

                .text-v {
                    background: lightgray !important;
                    text-orientation: mixed;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    line-height: 2em;
                    vertical-align: middle;
                }
                .text-v > p {
                    transform: rotate(90deg);
                    width: 2rem;
                    white-space: nowrap;
                    margin-left: -3px;
                    margin-top: -40px;
                    margin-top: -70%;
                    margin-bottom: -50%;
                }

                .tb-main col:nth-child(1) {
                    width: 3%;
                }

                .tb-main col:nth-child(2) {
                    width: 8%;
                }

                .tb-main col:nth-child(3) {
                    width: 33%;
                }

                .tb-main col:nth-child(n+4) {
                    width: 4.5%;
                }

                .tb-head {
                    width: 100%;
                }

                .tb-head col:nth-child(1) {
                    width: 42%;
                    border: none;
                }

                .tb-head col:nth-child(2) {
                    background-color: lightgray;
                    width: 50%;
                }

                .tb-ovr {
                    width: 100%;
                }
                .tb-ovr > thead {
                    background: lightgray;
                    border-bottom-width: 2px;
                }
                .tb-ovr > thead > tr > th {
                    font-weight: light !important;
                    /*font-family: "Fira Code Light"*/
                }
                .tb-ovr col:nth-child(1) {
                    width: 30%;
                }
                
                

            </style>

            <title>Transcript</title>
          </head>
        
          <body class="m-0">
            <div class="container-fluid px-1" ref="{ref}">
              <div class="container-fluid">
                <div class="row header pt-3">
                  <div class="col-2">
                    <img src="${logo}" alt="logo" class="giki-logo" />
                  </div>
        
                  <div class="title col-10">
                    <h2 class="uni-name">
                      Ghulam Ishaq Khan Institute of Engineering Sciences and Technology
                    </h2>
                    <h4>PLO Transcript</h4>
                  </div>
                </div>
                <div class="student-data px-4 py-2">
                  <p><b>Name:</b> ${studentName}</p>
                  <p><b>Registration Number:</b> ${regNum}</p>
                  <p><b>Faculty:</b> ${faculty}</p>
                </div>
              </div>
              <div>
              <table class="tb-head table table-borderless lh-1 mb-1">
              <col><col>
                                <thead>
                                    <tr>
                                    <th
                                        class="border-start-1 border-end-0 border-top-0 fw-normal"
                                        scope="col"
                                    >
                                    </th>
                                    
                                    <th
                                        class="rowhead"
                                        scope="col"
                                    >
                                        PLOs
                                    </th>
                                    </tr>
                                </thead>
                                </table>
                ${Object.keys(details)
                  .map((row_r) => {
                    const ordered = Object.keys(details[row_r])
                      .sort()
                      .reduce((obj, key) => {
                        obj[key] = details[row_r][key];
                        return obj;
                      }, {});
                    let count = {};
                    return `
                    <div>
                    
                        ${Object.keys(ordered)
                          .map(
                            (year) => `
                            <div>
                            <div class="w-100 mt-0 mb-0">
                                <table class="tb-main table table-bordered lh-1">
                                <col><col><col><col><col><col><col><col><col><col><col><col><col><col><col>
                                <thead>
                                    <tr>
                                    ${(() => {
                                      for (var key in count) delete count[key];
                                      return '';
                                    })()}
                                    <th >Sem.</th>
                                    <th >Code</th>
                                    <th >Course</th>
                                    <th class="w-10">1</th>
                                    <th class="w-10">2</th>
                                    <th class="w-10">3</th>
                                    <th class="w-10">4</th>
                                    <th class="w-10">5</th>
                                    <th class="w-10">6</th>
                                    <th class="w-10">7</th>
                                    <th class="w-10">8</th>
                                    <th class="w-10">9</th>
                                    <th class="w-10">10</th>
                                    <th class="w-10">11</th>
                                    <th class="w-10">12</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr>
                                <td
                                        class="text-v"
                                        scope="col"
                                        rowspan="0"
                                    ><p>
                                        ${(() => {
                                          if (Number(year) == 3)
                                            return `F ${row_r}`;
                                          else if (Number(year) == 2)
                                            return `SU ${row_r}`;
                                          else return `SP ${row_r}`;
                                        })()}</p>
                                    </td>
                                    ${details[row_r][year]
                                      .map(
                                        (row) => `
                                    
                                    <td scope="row">${row.CourseCode}</td>
                                    <td scope="row">${row.courseTitle}</td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO1),
                                          count,
                                          'PLO1',
                                        )}
                                                ${yesNo(row.PLO1)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO2),
                                          count,
                                          'PLO2',
                                        )}
                                                ${yesNo(row.PLO2)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO3),
                                          count,
                                          'PLO3',
                                        )}
                                                ${yesNo(row.PLO3)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO4),
                                          count,
                                          'PLO4',
                                        )}
                                                ${yesNo(row.PLO4)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO5),
                                          count,
                                          'PLO5',
                                        )}
                                                ${yesNo(row.PLO5)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO6),
                                          count,
                                          'PLO6',
                                        )}
                                                ${yesNo(row.PLO6)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO7),
                                          count,
                                          'PLO7',
                                        )}
                                                ${yesNo(row.PLO7)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO8),
                                          count,
                                          'PLO8',
                                        )}
                                                ${yesNo(row.PLO8)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO9),
                                          count,
                                          'PLO9',
                                        )}
                                                ${yesNo(row.PLO9)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO10),
                                          count,
                                          'PLO10',
                                        )}
                                                ${yesNo(row.PLO10)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO11),
                                          count,
                                          'PLO11',
                                        )}
                                                ${yesNo(row.PLO11)}
                                    </td>
                                    <td scope="row">
                                        ${count_semester(
                                          yesNo(row.PLO12),
                                          count,
                                          'PLO12',
                                        )}
                                                ${yesNo(row.PLO12)}
                                    </td>
                                    </tr>
                                    `,
                                      )
                                      .join('')}
                                    <tr>
                                    <td scope="row" colspan="2" class="table-light rowhead">
                                        <b>Semester Attainment</b>
                                                ${semesterGP(count)} 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO1
                                            ? count.PLO1['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO2
                                            ? count.PLO2['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO3
                                            ? count.PLO3['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO4
                                            ? count.PLO4['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO5
                                            ? count.PLO5['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO6
                                            ? count.PLO6['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO7
                                            ? count.PLO7['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO8
                                            ? count.PLO8['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO9
                                            ? count.PLO9['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO10
                                            ? count.PLO10['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO11
                                            ? count.PLO11['semester']
                                            : '-'
                                        } 
                                    </td>
                                    <td scope="row">
                                        ${
                                          count.PLO12
                                            ? count.PLO12['semester']
                                            : '-'
                                        } 
                                    </td>
                                    </tr>
                                    <tr>
                                    <td scope="row" colspan="2" class="table-light rowhead">
                                        <b>Cummulative Attainment</b>
                                                ${commulativePLO()}
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO1
                                            ? commulative.PLO1['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO2
                                            ? commulative.PLO2['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO3
                                            ? commulative.PLO3['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO4
                                            ? commulative.PLO4['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO5
                                            ? commulative.PLO5['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO6
                                            ? commulative.PLO6['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO7
                                            ? commulative.PLO7['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO8
                                            ? commulative.PLO8['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO9
                                            ? commulative.PLO9['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO10
                                            ? commulative.PLO10['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO11
                                            ? commulative.PLO11['semester']
                                            : '-'
                                        }
                                    </td>
                                    <td scope="row">
                                        ${
                                          commulative.PLO12
                                            ? commulative.PLO12['semester']
                                            : '-'
                                        }
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            ${
                              row_r == rowYear && year == yearLast
                                ? ` <div>
                        <table class="table table-bordered tb-ovr">
                           
                            <col><col><col><col><col><col><col><col><col><col><col><col><col>
                            <thead>
                            <tr>
                                    <th scope="row" class="rowhead">
                                        PLOs
                                    </th>
                                    <th class="w-10">1</th>
                                    <th class="w-10">2</th>
                                    <th class="w-10">3</th>
                                    <th class="w-10">4</th>
                                    <th class="w-10">5</th>
                                    <th class="w-10">6</th>
                                    <th class="w-10">7</th>
                                    <th class="w-10">8</th>
                                    <th class="w-10">9</th>
                                    <th class="w-10">10</th>
                                    <th class="w-10">11</th>
                                    <th class="w-10">12</th>
                                </tr>
                              <tr>
                                <th scope="row" class="rowhead">
                                  KPI
                                </th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                                <th class="w-10">&ge; 0.5</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td scope="row" class="table-light rowhead w-10">
                                  Overall Attainment
                                </td>
                                <td>
                                  ${
                                    commulative.PLO1
                                      ? passFail(commulative.PLO1['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO2
                                      ? passFail(commulative.PLO2['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO3
                                      ? passFail(commulative.PLO3['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO4
                                      ? passFail(commulative.PLO4['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO5
                                      ? passFail(commulative.PLO5['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO6
                                      ? passFail(commulative.PLO6['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO7
                                      ? passFail(commulative.PLO7['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO8
                                      ? passFail(commulative.PLO8['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO9
                                      ? passFail(commulative.PLO9['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO10
                                      ? passFail(commulative.PLO10['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO11
                                      ? passFail(commulative.PLO11['semester'])
                                      : '-'
                                  }
                                </td>
                                <td>
                                  ${
                                    commulative.PLO12
                                      ? passFail(commulative.PLO12['semester'])
                                      : '-'
                                  }
                                </td>
                              </tr>
                            </tbody>
                          
                        </table>
                      </div> `
                                : ''
                            }
                            </div>
                        `,
                          )
                          .join('')}
                    </div>
                    `;
                  })
                  .join('')}
              </div>
              <div class="row justify-content-end mt-5">
                <div class="col-2">
                    <figure class="figure">
                        <img src="${signature}" alt="logo" class="giki-logo" />    
                        <figcaption class="figure-caption text-end">Dean FME</figcaption>
                    </figure>
                </div>
              </div>
                <div class="row text-muted foot">
                    <hr>
                    <h6 class="fst-italic">Note</h6>
                    <p class="lh-1">This an electronic document generated via automated scripts.
                    <br>Errors and Omissions are accepted.
                        <br>P  :  Pass
                        <br>F  :  Fail
                        <br>&#9866;  :  Either no mapping or result not available yet</p>
                </div>
              </div>
            </div>
          </body>
        </html>
        
        `;
}
