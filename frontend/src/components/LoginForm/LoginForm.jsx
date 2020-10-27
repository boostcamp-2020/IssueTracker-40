import React from "react";

const LoginForm = () => {
    return (
        <form>
            <label htmlFor="email">
                <input type="text" id="email" name="email" placeholder="email..." required />
            </label>
            <label htmlFor="password">
                <input type="text" id="password" name="password" placeholder="password..." required />
            </label>
        </form>
    );
};

export default LoginForm;
