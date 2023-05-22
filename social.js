let baseUrl = "https://tarmeezacademy.com/api/v1";

let currentPage = 1;
let lastPage = 1;
function getPosts(reload = true, page = 1) {
  setLoader(true);
  axios
    .get(`${baseUrl}/posts?limit=8&page=${page}`)
    .then(function (response) {
      lastPage = response.data.meta.last_page;
      let postsDiv = document.getElementById("posts");
      if (reload) {
        postsDiv.innerHTML = "";
      }
      let posts = response.data.data;
      for (post of posts) {
        let postTitle = "";
        if (post.title != null) {
          postTitle = post.title;
        }
        let userProfile = "";
        if (typeof post.author.profile_image != "object") {
          userProfile = post.author.profile_image;
        } else {
          userProfile = "Profile-imgs/user.png";
        }
        let userString = localStorage.getItem("user");
        let user = JSON.parse(userString);
        let myPost = user != null && user.id == post.author.id;
        let buttonContent = ``;
        if (myPost) {
          buttonContent = `
                <div id="upadteAndDeleteDiv" style="float: right; margin-top: 10px;">
                  <button type="button" class="btn btn-outline-primary btn-sm" onclick = "editBtnCliked('${encodeURIComponent(
                    JSON.stringify(post)
                  )}')">Edit</button>
                  <button type="button" class="btn btn-outline-danger btn-sm" onclick = "DeletBtnClicked(${
                    post.id
                  })">Delete</button>
                </div>
          `;
        }
        let card = `            
        <div class="card shadow mb-5">
              <div class="card-header bg-body-secondary">
                <span id="userDetails" style="cursor: pointer;" onclick="userDivClicked(${post.author.id})">
                  <img
                    src="${userProfile}"
                    alt=""
                    class="border border-3 rounded-circle"
                    style="width: 50px; height: 50px"
                  />
                  <span class="fw-bold ms-2">${post.author.name}</span>
                </span>
                ${buttonContent}
              </div>
              <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
                <img
                  src="${post.image}"
                  alt=""
                  class="rounded img-fluid w-100"
                />
                <span class="text-black-50 fw-bold">${post.created_at}</span>
                <h5 class="fw-bold mt-3">${postTitle}</h5>
                <p class="mt-0">${post.body}</p>
                <hr />
                <div class="comments">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pen"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
                    />
                  </svg>
                  <span class="ms-2">(${post.comments_count}) Comments
                    <span id="post-tags-${post.id}">
                        <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">Sport</button>
                    </span>
                  </span>
                </div>
              </div>
            </div>`;
        // todo: make suer that tags run successfully
        postsDiv.innerHTML += card;
        let postId = `post-tags-${post.id}`;
        let currentPostTagID = document.getElementById(postId);
        currentPostTagID.innerHTML = "";
        for (tag of post.tags) {
          let tagContenet = `
          <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">${tag.name}</button>
          `;
          currentPostTagID.innerHTML += tagContenet;
        }
      }
    })
    .catch(function (error) {
      if (document.getElementById("posts") != null) {
        sucssecAlert("Network error", "danger");
      }
    })
    .finally(() => {
      setLoader(false);
    });
}

function loginClicked() {
  let username = document.getElementById("usaername-input").value;
  let password = document.getElementById("password-input").value;
  let url = `${baseUrl}/login`;
  let body = {
    username: username,
    password: password,
  };
  setLoader(true);
  axios
    .post(url, body)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      let model = document.getElementById("login-model");
      let modelInst = bootstrap.Modal.getInstance(model);
      modelInst.hide();
      sucssecAlert("Logged in successfully!!", "success");
      updateUi();
      setTimeout(() => {
        location.reload();
      }, 2000);
    })
    .catch(function (error) {
      sucssecAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      setLoader(false);
    });
}

function rigesterClicked() {
  let username = document.getElementById("rigester-usaername-input").value;
  let password = document.getElementById("rigester-password-input").value;
  let name = document.getElementById("rigester-name-input").value;
  let image = document.getElementById("rigester-image-input").files[0];
  let token = localStorage.getItem("token");
  let url = `${baseUrl}/register`;
  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("image", image);
  let headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  setLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      let model = document.getElementById("rigester-model");
      let modelInst = bootstrap.Modal.getInstance(model);
      modelInst.hide();
      sucssecAlert("A new user regesterd successfully!!", "success");
      updateUi();
    })
    .catch(function (error) {
      sucssecAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      setLoader(false);
    });
}

function logOut() {
  localStorage.clear();
  sucssecAlert("Logged out successfully!!", "success");
  updateUi();
  setTimeout(() => {
    location.reload();
  }, 2000);
}

function updateUi() {
  let loginDiv = document.getElementById("loginDiv");
  let logoutDiv = document.getElementById("logoutDiv");
  let addPostBtn = document.getElementById("addPostBtn");
  if (localStorage.getItem("token") != null) {
    if (addPostBtn != null) {
      addPostBtn.style.setProperty("display", "flex", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    setupUser();
  } else {
    if (addPostBtn != null) {
      addPostBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  }
}
updateUi();
function setupUser() {
  let userDiv = document.getElementById("userDiv");
  let userText = localStorage.getItem("user");
  let user = JSON.parse(userText);
  let userProfile = "";
  if (typeof user.image != "undefined") {
    userProfile = user.image;
  } else {
    userProfile = "Profile-imgs/user.png";
  }
  let userinfo = `
        <img src="${userProfile}" alt="" />
        <span>@${user.name}</span>
    `;
  userDiv.innerHTML = userinfo;
}
function sucssecAlert(message, type) {
  const alertPlaceholder = document.getElementById("SuccessAlertDiv");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.innerHTML = "";
    alertPlaceholder.append(wrapper);
  };
  appendAlert(message, type);
}
function postClicked(id) {
  window.location = `postDetails.html?postId=${id}`;
}
function CreataePostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreat = postId == null || postId == "";
  let title = document.getElementById("post-title-input").value;
  let body = document.getElementById("post-body-input").value;
  let image = document.getElementById("post-image-input").files[0];
  let token = localStorage.getItem("token");
  let url = "";
  let formdata = new FormData();
  formdata.append("title", title);
  formdata.append("body", body);
  formdata.append("image", image);
  let headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  if (isCreat) {
    url = `${baseUrl}/posts`;
  } else {
    formdata.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }
  setLoader(true);
  axios
    .post(url, formdata, {
      headers: headers,
    })
    .then((response) => {
      let model = document.getElementById("add-post-model");
      let modelInst = bootstrap.Modal.getInstance(model);
      modelInst.hide();
      if (isCreat) {
        sucssecAlert("New Post Created Successfully!!", "success");
      } else {
        sucssecAlert("Post Has Been Updated Successfully!!", "success");
      }
      getPosts();
    })
    .catch((error) => {
      sucssecAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      setLoader(false);
    });
}
function editBtnCliked(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  let postModal = new bootstrap.Modal(
    document.getElementById("add-post-model")
  );
  postModal.toggle();
  document.getElementById("modal-header").innerHTML = "Edit Post";
  document.getElementById("AddPostLoginBtn").innerHTML = "Edit";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  document.getElementById("post-id-input").value = post.id;
}
function AddPostClicked() {
  let postModal = new bootstrap.Modal(
    document.getElementById("add-post-model")
  );
  postModal.toggle();
  document.getElementById("modal-header").innerHTML = "Create A New Post";
  document.getElementById("AddPostLoginBtn").innerHTML = "Create";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  document.getElementById("post-id-input").value = "";
}
let deletId = 1;
function DeletBtnClicked(id) {
  let postModal = new bootstrap.Modal(document.getElementById("DeleteModal"));
  postModal.toggle();
  deletId = id;
}
function submitDelete() {
  let url = `${baseUrl}/posts/${deletId}`;
  let token = localStorage.getItem("token");
  let headers = {
    authorization: `Bearer ${token}`,
  };
  console.log(token);
  setLoader(true);
  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      let model = document.getElementById("DeleteModal");
      let modelInst = bootstrap.Modal.getInstance(model);
      modelInst.hide();
      sucssecAlert("Post Has Been Deleted Successfully!!", "success");
      getPosts();
    })
    .catch((error) => {
      sucssecAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      setLoader(false);
    });
}
function userDivClicked(id) {
  window.location = `profile.html?userId=${id}`;
}
function profileTapClicked() {
  let strinUser = localStorage.getItem("user");
  let user = JSON.parse(strinUser);
  if (user != null) {
    let id = user.id;
    window.location = `profile.html?userId=${id}`;
  } else {
    sucssecAlert("You Must Login First To See Your Profile", "danger");
  }
}
getPosts();
function setLoader(run = true) {
  if (run) {
    document.getElementById("loader").style.display = "flex";
  } else {
    document.getElementById("loader").style.display = "none";
  }
}
// test github
// test github
// post tow id = 580
// post one id = 576
