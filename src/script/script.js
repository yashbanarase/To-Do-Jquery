function LoadPage(pagePath) {
  $.ajax({
    method: "get",
    url: `../../public/pages/${pagePath}`,
    success: (data) => {
      $("section").html(data);
    },
  });
}

function LoadDashboard() {
  $.ajax({
    method: "get",
    url: "../../public/pages/user_dashboard.html",
    success: (data) => {
      $("section").html(data);
      $.ajax({
        method: "get",
        url: `http://127.0.0.1:4040/users/${$.cookie("userId")}`,
        success: (data) => {
          $("#lblUser").html(data.user_name);
          $.ajax({
            method: "get",
            url: `http://127.0.0.1:4040/appointments/${$.cookie("userId")}`,
            success: (appointments) => {
              appointments.map((appointment) => {
                $("#apointmentList")
                  .append(`<div id="bsCard" class="card  mb-2">
              <h3 class="card-header">${appointment.title.replaceAll(
                ".",
                " "
              )}</h3>
              <div class="card-body">
                <h5 class="card-title">Discription: ${
                  appointment.description
                }</h5>
                <p class="card-text">Date: ${appointment.date.slice(
                  0,
                  appointment.date.indexOf("T")
                )}</p>
                    <div class="text-end"><a href="#" name="${
                      appointment.title
                    }" id="btnEdit" class="btn btn-warning bi bi-pen-fill"></a>
                <a href="#" name="${appointment.title.replaceAll(
                  " ",
                  "."
                )}" id="btnDelete"  class="btn btn-danger bi bi-trash-fill"></a></div>
              </div>
            </div>
            `);
              });
            },
          });
        },
      });
    },
  });
}

$(() => {
  if ($.cookie("userId")) {
    LoadDashboard();
  } else {
    LoadPage("home.html");
  }
});
$(document).on("click", "#btnLogin", () => {
  LoadPage("login.html");
});
$(document).on("click", "#btnSignIn", () => {
  LoadPage("signin.html");
});

$(document).on("click", "#registerUser", () => {
  var newUser = {
    user_id: $("#inputUserId").val(),
    user_name: $("#inputUserName").val(),
    password: $("#inputPassword").val(),
    mobile: $("#inputMobile").val(),
  };

  $.ajax({
    method: "post",
    url: "http://127.0.0.1:4040/register-user",
    data: newUser,
    success: () => {
      alert("User Registered");
    },
  });
  LoadPage("login.html");
});

$(document).on("click", "#loginUser", () => {
  var user_id = $("#loginInputUserName").val();
  var password = $("#loginInputPassword").val();
  $.ajax({
    method: "get",
    url: `http://127.0.0.1:4040/users/${$("#loginInputUserName").val()}`,
    success: (userDetail) => {
      if (userDetail) {
        if (userDetail.password === password) {
          $.cookie("userId", user_id, { expires: 2 });
          LoadDashboard();
        } else {
          alert("Invalid Password");
        }
      } else {
        alert("User Not found");
      }
    },
  });
});
//adding Appointments.

$(document).on("click", "#addAppointments", () => {
  LoadPage("addAppointments.html");
});
$(document).on("click", "#saveAppointment", () => {
  var title = $("#appointmentTitle").val().replaceAll(" ", ".");
  var appointment = {
    title: $("#appointmentTitle").val().replaceAll(" ", "."),
    date: $("#inputDate").val(),
    description: $("#inputUserDiscription").val(),
    user_id: $.cookie("userId"),
  };

  $.ajax({
    method: "get",
    url: `http://127.0.0.1:4040/appointments/${$.cookie("userId")}`,
    success: (appointments) => {
      var result = appointments.find((appo) => appo.title === title);
      if (result) {
        alert("Appointment Already exist");
        LoadDashboard();
      } else {
        $.ajax({
          method: "post",
          url: "http://127.0.0.1:4040/add-appointment",
          data: appointment,
          success: () => {
            alert("appointment added");
            LoadDashboard();
          },
        });
      }
    },
  });
});
$(document).on("click", "#btnEdit", (e) => {
  LoadPage("editAppointment.html");
  $.ajax({
    method: "get",
    url: `http://127.0.0.1:4040/appointment/${e.target.name}`,
    success: (data) => {
      console.log(data);
      $("#appointmentTitle").val(data[0].title.replaceAll(".", " "));
      $("#inputUserDiscription").val(data[0].description);
      $("#inputDate").val(data[0].date.slice(0, data[0].date.indexOf("T")));
    },
  });
  $(document).on("click", "#updateAppointment", () => {
    var appointment = {
      title: $("#appointmentTitle").val().replaceAll(" ", "."),
      description: $("#inputUserDiscription").val(),
      date: $("#inputDate").val(),
      user_id: $.cookie("userId"),
    };
    $.ajax({
      method: "put",
      url: `http://127.0.0.1:4040/edit-appointment/${e.target.name}`,
      data: appointment,
      success: () => {
        alert("Appointment Edited");
      },
    });
    LoadDashboard();
  });
});
$(document).on("click", "#cancelAppointment", () => {
  LoadDashboard();
});

$(document).on("click", "#btnDelete", (e) => {
  var result = confirm("Appointment Deleted");
  if (result) {
    $.ajax({
      method: "delete",
      url: `http://127.0.0.1:4040/delete-appointment/${e.target.name}`,
      success: () => {
        alert("Appointment Deleted");
        LoadDashboard();
      },
    });
  } else {
    LoadDashboard();
  }
});
$(document).on("click", "#goToHome", () => {
  $.removeCookie("userId");
  LoadPage("home.html");
});
