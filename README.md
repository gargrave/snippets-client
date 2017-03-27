# Snippets

> Snippets is my take on a "light bookmarking" app in the spirit of Pocket or Google Keep. I found that neither of those apps worked exactly the way I wanted them, so I decided to just build my own. It focuses less on note-taking and image-snipping and more on just being a temporary bookmarking solution--ideal for keeping a link you want to come back to but don't want to commit to with a permanent bookmark in your browser (e.g. a video you're in the middle of watching or a Reddit thread you want to come back to later).

It is built primarily with [VueJS 2](https://github.com/vuejs/vue) + Vuex, and uses [Element](http://element.eleme.io/#/en-US) for the UI layer. Aside from those, it uses a lot of the usual suspects as far as JS libraries go. Test coverage is in a pretty sad state, but I just didn't have the time to keep up with it for something that is no more than a personal project.

(The repository for the Django server-side code will be linked here soon.)

# Demo

You can see a dev/demo version [here](https://gargrave-snippets-dev.netlify.com). You can sign up for a new account, and everything should be working (there is no "forgot password" functionality, though, so remember your password). Bear in mind that the server is running a free Heroku instance, so don't be frightened if there are performance issues.

## VueJS CLI Stuff

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run all tests
npm test
```
