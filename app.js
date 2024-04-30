const loadPosts = () => {
    fetch("https://momentscape.onrender.com/post/posts/")
        .then((res) => res.json())
        .then((data) => displayPosts(data))
        .catch((err) => console.log(err));
};


const reacts_comments = (post_id) => {
    var reactPromise = fetch(`https://momentscape.onrender.com/post/react/?post_id=${post_id}`)
        .then((res) => res.json())
        .then((data) => data.length)
        .catch((err) => console.log(err));

    var likePromise = fetch(`https://momentscape.onrender.com/post/react/?post_id=${post_id}&like=true`)
        .then((res) => res.json())
        .then((data) => data.length)
        .catch((err) => console.log(err));

    var commentPromise = fetch(`https://momentscape.onrender.com/post/comment/?post_id=${post_id}`)
        .then((res) => res.json())
        .then((data) => data.length)
        .catch((err) => console.log(err));

    return Promise.all([reactPromise, likePromise, commentPromise])
        .then(([react, like, comment]) => {
            var dislike = react - like;
            // console.log({ like, dislike, comment });
            return { like, dislike, comment };
        })
        .catch((err) => {
            console.log(err);
            return { like: 0, dislike: 0, comment: 0 };
        });
};

const get_time = (created_at) => {
    const timestamp = created_at;

    const createdAt = new Date(timestamp);

    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // console.log("Days:", days);
    // console.log("Hours:", hours);
    // console.log("Minutes:", minutes);

    if (days) {
        return `${days} days ago`;
    } else if (hours) {
        return `${hours} hours ago`;
    } else {
        return `${minutes} minutes ago`;
    }
}

const user_info = (user_id) => {
    if (user_id) {
        return fetch(`https://momentscape.onrender.com/account/profile/?user_id=${user_id}`)
            .then((res) => res.json())
            .then((photo) => {
                return fetch(`https://momentscape.onrender.com/users/?user_id=${user_id}`)
                    .then((res) => res.json())
                    .then((user) => {
                        return { name: `${user[0].first_name} ${user[0].last_name}`, dp: photo[0].dp };
                    });
            })
            .catch((err) => console.log(err));
    }
};


const displayPosts = async (posts) => {
    const parent = document.getElementById("posts");
    parent.innerHTML = ``;
    for (const post of posts) {
        const time = await get_time(post.created_at);
        const result = await reacts_comments(post.id);
        const info = await user_info(post.user);
        // console.log(info);
        const div = document.createElement('div');
        div.classList.add('m-auto', 'bg-light', 'rounded-3', 'p-4', 'custom-shadow', 'w-100');
        div.innerHTML = `
            <div class="d-flex align-items-center">
                <img id="post_user" class="icon rounded-5" src=${info.dp} alt="">
                <div class="ms-2">
                    <h5 id="userName" class="m-0 p-0">${info.name}</h5>
                    <small class="m-0 p-0">${time}</small>
                </div>
                <a class="fa-solid fa-ellipsis dots ms-auto me-2 nav-link p-2" href="#" id="dropdownRight"
                    role="button" data-bs-toggle="dropdown" aria-expanded="false"></a>

                <ul class="dropdown-menu border-secondary-subtle" aria-labelledby="dropdownRight">
                    <li><a class="dropdown-item" href="#">Edit</a></li>
                    <li><a class="dropdown-item" href="#">Remove Post</a></li>
                </ul>
            </div>
            <p class="mt-2 ms-3">
                ${post.content}
            </p>
            ${post.image ? `<div class="post-img">
                <img class="img-fluid " src="${post.image}" alt="image">
            </div>` : ''}
            <div class="d-flex align-items-center justify-content-between mt-3 px-4">
                <div class="ms-2">
                    <a class="fa-solid fa-thumbs-up size text-decoration-none text-secondary" href="#"
                        id="dropdownRight" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false"></a>
                    <small>${result.like} likes and ${result.dislike} dislikes</small>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <p class="d-flex m-0">
                            <a onclick="like_post(${post.id})" class="dropdown-item fa-solid fa-thumbs-up size text-decoration-none"></a>
                            <a onclick="dislike_post(${post.id})" class="dropdown-item fa-solid fa-thumbs-down size text-decoration-none"></a>
                        </p>
                    </div>
                </div>
                <p></p>
                <!-- Button trigger modal -->
                <p type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i onclick="creat_post()" class="fa-solid fa-comment size"></i> <small>${result.comment} comments</small>
                </p>
            </div>`;
        parent.appendChild(div);
    }
}

var userId = localStorage.getItem("user_id");
const load_user = () => {

    console.log(userId);
    const profile = document.getElementById('profile');
    if (userId) {
        fetch(`https://momentscape.onrender.com/account/profile/?user_id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                profile.innerHTML = `
                <img  class="icon rounded-5" src="${data[0].dp}" alt="profile">
                `;
            })
            .catch((err) => console.log(err));
        fetch(`https://momentscape.onrender.com/users/?user_id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                const div = document.createElement('div');
                div.classList.add('ms-2');
                div.innerHTML = `
                <h5 class="m-0 p-0">${data[0].first_name} ${data[0].last_name}</h5>
                <small class="m-0 p-0">Public</small>
                `;
                profile.appendChild(div);
            })
            .catch((err) => console.log(err));
    }

}
const creat_post = () => {
    const content = getValue('content');
    console.log(content);
    const post = {
        content,
        "image": null,
        "video_url": null,
        "user": userId
    }
    fetch("https://momentscape.onrender.com/post/posts/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(post),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error occurred during fetch:", error);
        });
}



const creatComments = (post_id) => {
    comment=document.getElementById("comment").value;
    const info =
    {
        "content": comment,
        "user": userId,
        "post": post_id
    }

    if (post_id) {
        fetch("https://momentscape.onrender.com/post/comment/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(info),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch(error => {
                console.error("Error occurred during fetch:", error);
            });
    }
}

const like_post = (post_id) => {
    const info = {
        "like": true,
        "dislike": false,
        "user": userId,
        "post": post_id
    }
    if (post_id) {
        fetch("https://momentscape.onrender.com/post/react/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(info),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch(error => {
                console.error("Error occurred during fetch:", error);
            });
    }
}
const dislike_post = (post_id) => {
    const info = {
        "like": false,
        "dislike": true,
        "user": userId,
        "post": post_id
    }
    if (post_id) {
        fetch("https://momentscape.onrender.com/post/react/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(info),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch(error => {
                console.error("Error occurred during fetch:", error);
            });
    }
}
load_user();
loadPosts();
