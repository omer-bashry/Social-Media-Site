let urlPrams = new URLSearchParams(window.location.search);
let userId = urlPrams.get("userId");
getUserInfo();
getUserPosts();
function getUserInfo() {
  setLoader(true);
  axios
    .get(`${baseUrl}/users/${userId}`)
    .then((response) => {
      let userInfo = response.data.data;
      if (typeof userInfo.profile_image != "object") {
        document.getElementById("user-profile").src = userInfo.profile_image;
      } else {
        document.getElementById("user-profile").src = `Profile-imgs/user.png`;
      }
      document.getElementById("user-email").innerHTML = userInfo.email;
      document.getElementById("user-name").innerHTML = userInfo.name;
      document.getElementById("user-username").innerHTML = userInfo.username;
      document.getElementById("userPostsCount").innerHTML =
        userInfo.posts_count;
      document.getElementById("userCommenteCount").innerHTML =
        userInfo.comments_count;
    })
    .catch((error) => {
      sucssecAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      setLoader(false);
    });
}
function getUserPosts() {
  setLoader(true);
  axios
    .get(`${baseUrl}/users/${userId}/posts`)
    .then((response) => {
      let posts = response.data.data;
      let postsDiv = document.getElementById("userPosts");
      postsDiv.innerHTML = "";
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
                <img
                  src="${userProfile}"
                  alt=""
                  class="border border-3 rounded-circle"
                  style="width: 50px; height: 50px"
                />
                <span class="fw-bold ms-2">${post.author.name}</span>
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
    .catch((error) => {
      if (document.getElementById("posts") != null) {
        sucssecAlert("Network error", "danger");
      }
    })
    .finally(() => {
      setLoader(false);
    });
}
