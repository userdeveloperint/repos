import { fetchData } from './fetchData'

function getGithubUser(user) {
  if (!user) {
    throw Error('User name is not defined.')
  }

  return fetchData({ url: `https://api.github.com/users/${user}`})
    .then(data => data.json())
}

function getUserRepos(user) {
  if (!user) {
    throw Error('user is not defined.')
  }

  return fetchData({ url: `https://api.github.com/users/${user}/repos` })
  .then(data => data.json())
}

function filterRepos({ users, userRepos }) {
  if (!Array.isArray(users)) {
    throw Error('users is not defined.')
  }

  if (!Array.isArray(userRepos)) {
    throw Error('userRepos is not defined.')
  }

  
  return users.map((user, i) => {
    const errorMessage = userRepos[i]?.message;
    if (errorMessage) {
      return { username: user.username, repos: [], errorMessage };
    }

    let repos = userRepos[i];
    const updatedAt = new Date(user?.updated_at)
    if(user?.updated_at && !isNaN(updatedAt)) {
      repos = userRepos[i].filter( repo => new Date(repo?.updated_at) >= updatedAt);
    }

    return { username: user.username, repos }
  })
}

function getUsers() {
  return Array.from(document.getElementsByTagName('repos'))
    .map(repo => ({
      username: repo.dataset.user,
      updated_at: repo.dataset.update,
      el: repo
    }))
}

function getRepoTrEl(repo) {
  if (!repo) {
    throw Error('repo is not defined.')
  }
  
  const tr = document.createElement('tr');

  const repoNameTd = document.createElement('td');
  repoNameTd.innerHTML = repo?.name;
    tr.appendChild(repoNameTd);

  const descriptionTd = document.createElement('td');
    descriptionTd.innerHTML = repo?.description || '-';
    tr.appendChild(descriptionTd);

  const lastUpdateTd = document.createElement('td');
    lastUpdateTd.innerHTML = repo?.updated_at;
    tr.appendChild(lastUpdateTd);

  const downloadLinkTd = document.createElement('td');
    const downloadLink = document.createElement('a');
    downloadLink.href = repo?.downloads_url;
    downloadLink.target = '_blank';
    downloadLink.title = 'download';
    downloadLink.innerHTML = '^'
    downloadLinkTd.appendChild(downloadLink);
    tr.appendChild(downloadLinkTd)

  return tr;
}

function getUserRepoEl({ username, repos, errorMessage }) {
  if (!username) {
    throw Error('username is not defined.')
  }

  if (!repos) {
    throw Error('repos is not defined.')
  }

  const repoContainerEl = document.createElement('div');
    repoContainerEl.classList.add('user-repo');

  const usernameEl = document.createElement('h3');
    usernameEl.innerHTML = username;

  repoContainerEl.appendChild(usernameEl);

  if (errorMessage) {
    const errorMessageEl = document.createElement('div');
    errorMessageEl.classList.add('error-message')
    errorMessageEl.innerHTML = errorMessage;
    repoContainerEl.appendChild(errorMessageEl)

    return { username, repoEl: repoContainerEl };
  }

  const tbl = document.createElement('table');
  const tblHeader = document.createElement('thead');
  ['Repository name', 'Repository description', 'Last update date', 'URL to download repository'].forEach(title => {
    const th = document.createElement('th');
    th.innerHTML = title;
    tblHeader.appendChild(th);
  })
  
  tbl.appendChild(tblHeader);

  const tblBody = document.createElement('tbody')
  
  const userReposTrEl = repos.map(getRepoTrEl)
  
  userReposTrEl.map(userRepoTr => tblBody.appendChild(userRepoTr));
  tbl.appendChild(tblBody);
  repoContainerEl.appendChild(tbl)

  return { username, repoEl: repoContainerEl };
}

function displayRepos(reposByUsername, users) {
  if (!Array.isArray(reposByUsername)) {
    throw Error('reposByUsername is not defined.')
  }


  const reposEl = reposByUsername.map(getUserRepoEl);

  reposEl.map(({ username, repoEl }) => {
    const repoInfoEl = users.find(user => user.username === username)?.el;

    repoInfoEl.parentNode.replaceChild(repoEl, repoInfoEl)
  })  
}

export { getUsers, getGithubUser, getUserRepos, filterRepos, displayRepos };
