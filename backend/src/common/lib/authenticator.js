import passport from "passport";
import {Strategy as GitHubStrategy} from'passport-github';
import {generateJWTToken} from "./token-generator";

 const authenticator = new (class{
    constructor() {
        this.passport = passport;
    }

    setStrategy(){
        this.passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL
          },
          function(accessToken, refreshToken, profile, cb) {  //accessToken 발급하고, profile 조회를 해주는듯?
            console.log('accessToken', accessToken);
            console.log('refreshToken', refreshToken);
            console.log('profile', profile);

            const token = generateJWTToken({
                name : profile.name,
                photos : profile.photos[0].value
            });

            return cb(null, token);
          }
        ))
    }

    initialize(httpSever){
        httpSever.use(passport.initialize());
    }

    getPassport(){
        return this.passport;
    }
})();

export default authenticator
