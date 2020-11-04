import passport from "./passport";
import * as GithubAuthenticator from "./github-authenticator";
import * as JwtAuthenticator from "./jwt-authenticator";

const initializeAuthenticator = (httpserver) => {
    GithubAuthenticator.setStrategy();
    JwtAuthenticator.setStrategy();
    httpserver.use(passport.initialize());
};

export { GithubAuthenticator, JwtAuthenticator, initializeAuthenticator };
