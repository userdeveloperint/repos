import { getUsers, getUserRepos, filterRepos, displayRepos } from "./githubUser";

import "../style/style.scss";

(async function initApp() {
  try {
    const users = getUsers()
    let userRepos = users.map(user => getUserRepos(user.username));
    userRepos = await Promise.all(userRepos);
    
    const reposByUpdateDate = filterRepos({ users, userRepos });
    displayRepos(reposByUpdateDate, users);
  }
  catch (err) {
    console.log('error ' + err);
  }
})();

