// function selectDate() {
//   let table = $('#audittrail').DataTable();
//   table.draw();
// }

// const renderDataOnTable = (data) => {
//   let rows = $.map( data, (row) => {
//     let newRow = $("<tr>")
//     $("<td>").text(row.username).appendTo(newRow)
//     $("<td>").text(row.msisdn).appendTo(newRow)
//     $("<td>").text(row.formattedStartDate).appendTo(newRow)
//     $("<td>").text(row.formattedEndDate).appendTo(newRow)
//     $("<td>").text(row.datetime).appendTo(newRow)

//     return newRow;
//   })
//   return rows
// }
const renderDataOnTable = data => {
  let table = $("#loantable").DataTable();
  //console.log(data);
  $.each(data, (i, item) => {
    table.row
      .add([
        item.SUB_ID,
        item.PRI_IDENTITY,
        item.OPER_TYPE,
        item.ADD_INFO_AMOUNT,
        item.OPER_DATE,
        item.INIT_LOAN_AMT,
        item.INIT_LOAN_POUNDAGE,
        item.LOAN_AMT,
        item.LOAN_POUNDAGE,
        item.REPAY_AMT,
        item.REPAY_POUNDAGE,
        item.UNPAID_AMT , 
        item.ETU_GRACE_DATE,
        item.FORCE_REPAY_DATE,
      ])
      .draw();
  });
};

$(document).ready(function() {
  const displayMessage = response => {
    if (response.success) {
      return swal({
        title: "Success",
        text: response.success,
        icon: "success",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
    }

    if (response.error) {
      return swal({
        title: "Error",
        text: response.error,
        icon: "error",
        buttons: true
      });
    }
  };

  let isUserUpdate = false;
  let userID = 0;
  let btnDeleteUsers = document.querySelectorAll("#btnDeleteUsers");
  let btnDownloadUserLog = document.querySelectorAll("#btnDownloadUserLog");
  let btnDeleteVehicle = document.querySelectorAll("#btnDeleteVehicle");
  let btnEditUsers = document.querySelectorAll("#btnEditUsers");
  let btnEditVehicle = document.querySelectorAll("#btnEditVehicle");
  let btnDeleteDepartment = document.querySelectorAll(".btnDeleteDepartment");
  let btnMakeVehicleAvailable = document.querySelectorAll(
    "#btnMakeVehicleAvailable"
  );

  //delete vehicles
  btnDownloadUserLog.forEach(btn => {
    btn.addEventListener("click", e => {
      var url = "UsersJALLOH1629083Node_appspolicePortallogaccess";
      e.preventDefault();

      document.location.href = url;
    });
  });

  //add new department
  $("#frmSaveDepartment").on("submit", e => {
    e.preventDefault();
    let errors = [];

    let form = $(this);
    let inputs = form.find(["input", "select", "textarea"]);

    //retrive data from the form being submitted
    const departmentName = $("#departmentName").val();

    if (departmentName === "") {
      errors.push("Enter department name");
    } else if (departmentName.length < 5 || departmentName.length > 50) {
      errors.push("Department name must be between 5 - 50 characters");
    }

    if (errors.length) {
      console.log(errors);
      return;
    }

    //send request to the server to save the vehicle
    $.ajax({
      url: "/admin/departments",
      method: "POST",
      data: {
        departmentName
      },
      success: response => {
        displayMessage(response);
      },
      failure: response => {
        console.log(response);
      }
    });
  });

  //assign department head
  $("#frmAssignDepartmentHead").on("submit", e => {
    e.preventDefault();
    let errors = [];

    let form = $(this);
    let inputs = form.find(["input", "select", "textarea"]);

    //retrive data from the form being submitted
    const departmentId = $("#departmentId").val();
    const hodId = $("#hodId").val();

    if (departmentId === "") {
      errors.push("Please select department");
    }

    if (hodId === "") {
      errors.push("Please select user");
    }

    if (errors.length) {
      console.log(errors);
      return;
    }

    //send request to the server to save the vehicle
    $.ajax({
      url: "/admin/assign-hod",
      method: "POST",
      data: {
        departmentId,
        hodId
      },
      success: response => {
        displayMessage(response);
      },
      failure: response => {
        console.log(response);
      }
    });
  });

  //post audit request
  $("#frmRequestAudit").on("submit", e => {
   // $('#spinner').modal();
    e.preventDefault();
    e.stopPropagation();

    //retrieve form values

    const startDate = $("#startDate").val();
    const endDate = $("#endDate").val();

    const today = moment(new Date()).format("DD/MM/YYYY");
    // const callStartDate = moment(new Date(startDate)).format("YYYYMMDD");
    // const callEndDate = moment(new Date(endDate)).format("YYYYMMDD");

    if (startDate.length == 0) {
      swal({
        title: "Error",
        text: "Please select Start Date",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    if (endDate.length == 0) {
      swal({
        title: "Error",
        text: "Please select End Date",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }
    if (
      moment(startDate, "DD/MM/YYYY", false).isBefore(
        moment(today, "DD/MM/YYYY", false)
      )
    ) {
      swal({
        title: "Error",
        text: "Please check your date input. YOU selected a date in the future",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    if (
      moment(endDate, "DD/MM/YYYY", false).isAfter(
        moment(startDate, "DD/MM/YYYY", false)
      )
    ) {
      swal({
        title: "Error",
        text: "Please check your end date input.",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    $.ajax({
      url: "/audit-dashboard",
      method: "POST",
      //processData:false,
      contentType: "application/json",
      dataType: "JSON",
      //cache:false,
      data: JSON.stringify({
        startDate: startDate,
        endDate: endDate
      }),
      success: response => {
        
        if (response.length > 0){
          console.log(response.length);
          //$('#spinner').hide();
        }
       
        renderDataOnTable(response);

        // location.reload();
         
      },
      failure: response => {
        console.log(response);
        $("#spinner").hide();
      }
    });
  });

  $("#frmSingleRequestAudit").on("submit", e => {
    // $('#spinner').modal();
     e.preventDefault();
     e.stopPropagation();
 
     //retrieve form values
     const countrycode = $("#countrycode").val();
     const ndc = $("#ndc").val();
     const number = $("#msisdn").val();
     const msisdn = countrycode + ndc + number;

     const startDate = $("#startDate").val();
     const endDate = $("#endDate").val();
    
     const today = moment(new Date()).format("DD/MM/YYYY");
     // const callStartDate = moment(new Date(startDate)).format("YYYYMMDD");
     // const callEndDate = moment(new Date(endDate)).format("YYYYMMDD");
 
     //msisdn validation
     if (!/^[0-9]+$/.test(msisdn)) {
      swal({
        title: "Error",
        text: "Please enter numeric characters only for your MSISDN!",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }
    console.log(number.length);
    if (number.length > 6 || number.length < 6) {
      swal({
        title: "Error",
        text:
          "Please enter a valid msisdn! Please note!! it should be 6 numbers",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    if (msisdn.length == 0) {
      swal({
        title: "Error",
        text: "Please enter msisdn",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }
    //Date Validation 
     if (startDate.length == 0) {
       swal({
         title: "Error",
         text: "Please select Start Date",
         icon: "error",
         buttons: true
       }).then(confirm => {
         if (confirm) {
           location.reload();
         } else {
           location.reload();
         }
       });
       return;
     }
 
     if (endDate.length == 0) {
       swal({
         title: "Error",
         text: "Please select End Date",
         icon: "error",
         buttons: true
       }).then(confirm => {
         if (confirm) {
           location.reload();
         } else {
           location.reload();
         }
       });
       return;
     }
     if (
       moment(startDate, "DD/MM/YYYY", false).isBefore(
         moment(today, "DD/MM/YYYY", false)
       )
     ) {
       swal({
         title: "Error",
         text: "Please check your date input. YOU selected a date in the future",
         icon: "error",
         buttons: true
       }).then(confirm => {
         if (confirm) {
           location.reload();
         } else {
           location.reload();
         }
       });
       return;
     }
 
     if (
       moment(endDate, "DD/MM/YYYY", false).isAfter(
         moment(startDate, "DD/MM/YYYY", false)
       )
     ) {
       swal({
         title: "Error",
         text: "Please check your end date input.",
         icon: "error",
         buttons: true
       }).then(confirm => {
         if (confirm) {
           location.reload();
         } else {
           location.reload();
         }
       });
       return;
     }
 
     $.ajax({
       url: "/single-audit-dashboard",
       method: "POST",
       //processData:false,
       contentType: "application/json",
       dataType: "JSON",
       //cache:false,
       data: JSON.stringify({
         msisdn: msisdn,
         startDate: startDate,
         endDate: endDate
       }),
       success: response => {
         
         if (response.length > 0){
           console.log(response.length);
           //$('#spinner').hide();
         }
        
         renderDataOnTable(response);
 
         // location.reload();
          
       },
       failure: response => {
         console.log(response);
         $("#spinner").hide();
       }
     });
   });

  //saves new request
  $("#frmSubmitSingleRequest").on("submit", e => {
    e.preventDefault();
    e.stopPropagation();

    //retrive form values
    const countrycode = $("#countrycode").val();
    const ndc = $("#ndc").val();
    const number = $("#msisdn").val();
    const msisdn = countrycode + ndc + number;
   

    if (!/^[0-9]+$/.test(msisdn)) {
      swal({
        title: "Error",
        text: "Please enter numeric characters only for your MSISDN!",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }
    console.log(number.length);
    if (number.length > 6 || number.length < 6) {
      swal({
        title: "Error",
        text:
          "Please enter a valid msisdn! Please note!! it should be 6 numbers",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    if (msisdn.length == 0) {
      swal({
        title: "Error",
        text: "Please enter msisdn",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    $.ajax({
      url: "/loan-logs",
      method: "POST",
      // //processData:false,
      // contentType:'application/json',
      // cache:false,
      // processData:false,
      data: {
        msisdn: msisdn
      },
      success: response => {
        console.log(response);
        renderDataOnTable(response);
        //console.log(data);
        // window.location.href = data;
        // var a = document.createElement('a');
        // a.href = data;
        // a.click();

        displayMessage(response);
        
      },
      failure: response => {
        console.log(response);
      }
    });
  });

  $("#frmSubmitRequest").on("submit", e => {
    $("#spinner").modal();
    e.preventDefault();
    e.stopPropagation();

    //retrive form values
    const bulkMSISDN = $("#bulkmsisdn")[0].files;
    const startDate = $("#startDate").val();
    const endDate = $("#endDate").val();

    const today = moment(new Date()).format("DD/MM/YYYY");
    const callStartDate = moment(new Date(startDate)).format("YYYYMMDD");
    const callEndDate = moment(new Date(endDate)).format("YYYYMMDD");
    console.log(bulkMSISDN.length);

    if (bulkMSISDN.length == 0) {
      swal({
        title: "Error",
        text: "Please select a file",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    if (startDate.length == 0) {
      swal({
        title: "Error",
        text: "Please select Start Date",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    if (endDate.length == 0) {
      swal({
        title: "Error",
        text: "Please select End Date",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }
    if (
      moment(startDate, "DD/MM/YYYY", false).isBefore(
        moment(today, "DD/MM/YYYY", false)
      )
    ) {
      swal({
        title: "Error",
        text: "Please check your date input. YOU selected a date in the future",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    if (
      moment(endDate, "DD/MM/YYYY", false).isAfter(
        moment(startDate, "DD/MM/YYYY", false)
      )
    ) {
      swal({
        title: "Error",
        text: "Please check your end date input.",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        } else {
          location.reload();
        }
      });
      return;
    }

    const msInHour = 1000 * 60 * 60;
    const hourDiff = Math.round(
      Math.abs(moment(endDate) - moment(startDate)) / msInHour
    );
    console.log(hourDiff);

    if (hourDiff > 2190) {
      swal({
        title: "Error",
        text: "All Call log request date should be between 3 months range",
        icon: "error",
        buttons: {
          cancel: false,
          confirm: true
        }
      }).then(confirm => {
        if (confirm) {
          location.reload();
        }
      });
      return;
    }

    const formData = new FormData(e.target);
    formData.delete("startDate");
    formData.delete("endDate");

    formData.append("startDate", callStartDate);
    formData.append("endDate", callEndDate);
    formData.append("bulkmsisdn", bulkMSISDN);

    console.log(formData);
    $.ajax({
      url: "/oldCall-logs",
      method: "POST",
      processData: false,
      contentType: false,
      cache: false,
      data: formData,
      success: response => {
        var { data } = response;
        console.log(response);
        window.location.href = data;
        // var a = document.createElement('a');
        // a.href = data;
        // a.click();

        displayMessage(response);
        $("#spinner").hide();
      },
      failure: response => {
        console.log(response);
        $("#spinner").hide();
      }
    });
  });

  //saves new request
  $("#frmSubmitImeiRequest").on("submit", e => {
    $("#contain").hide();
    $("#spinner").show();

    e.preventDefault();
    e.stopPropagation();

    //retrive form values
    const bulkIMEI = $("#bulkimei")[0].files;
    const startDate = $("#startDate").val();
    const endDate = $("#endDate").val();
    const today = moment(new Date()).format("DD/MM/YYYY");
    const callStartDate = moment(new Date(startDate)).format("YYYYMMDD");
    const callEndDate = moment(new Date(endDate)).format("YYYYMMDD");

    if (
      moment(startDate, "DD/MM/YYYY", false).isBefore(
        moment(today, "DD/MM/YYYY", false)
      )
    ) {
      swal({
        title: "Error",
        text: "Please check your date input. YOU selected a date in the future",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        }
      });
      return;
    }

    if (
      moment(endDate, "DD/MM/YYYY", false).isAfter(
        moment(startDate, "DD/MM/YYYY", false)
      )
    ) {
      swal({
        title: "Error",
        text: "Please check your end date input.",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        }
      });
      return;
    }

    const msInHour = 1000 * 60 * 60;
    const hourDiff = Math.round(
      Math.abs(moment(endDate) - moment(startDate)) / msInHour
    );
    console.log(hourDiff);

    if (hourDiff > 3650) {
      swal({
        title: "Error",
        text: "All Call log request date should be between 5 months range",
        icon: "error",
        buttons: true
      }).then(confirm => {
        if (confirm) {
          location.reload();
        }
      });
      return;
    }

    const formData = new FormData(e.target);
    formData.delete("startDate");
    formData.delete("endDate");

    formData.append("startDate", callStartDate);
    formData.append("endDate", callEndDate);
    formData.append("bulkimei", bulkIMEI);

    $.ajax({
      url: "/oldImei-check",
      method: "POST",
      processData: false,
      contentType: false,
      cache: false,
      data: formData,
      success: response => {
        console.log(response);
        displayMessage(response);
      },

      failure: response => {
        console.log(response);
      }
    });
  });

  $("#tblCallLogs").DataTable({
    dom: "Bfrtip",
    text: "Export",
    buttons: ["excel", "csv", "pdf", "print"],
    retrieve: true,
    paging: true
  });

  $("#audittrail").DataTable({
    dom: "Bfrtip",
    text: "Export",
    buttons: ["excel", "csv", "pdf", "print"],
    retrieve: true,
    paging: true
  });

  $("#loantable").DataTable({
    dom: "Bfrtip",
    buttons: ["pdf", "print", "excel"],
    lengthMenu: [[2, 4, 5, -1], [2, 4, 5, "All"]],
    pageLength: 10,
    retrieve: true,
    paging: true,
    // responsive: true
  });
  $("#userstable").DataTable({
    dom: "Bfrtip",
    buttons: ["pdf", "print", "excel"],
    lengthMenu: [[2, 4, 5, -1], [2, 4, 5, "All"]],
    pageLength: 10,
    retrieve: true,
    paging: true,
    // responsive: true
  });
});
