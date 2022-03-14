import React from "react";
import SignInForm from "./pages/Auth/SignInForm";
import SignUpForm from "./pages/Auth/SignUpForm";
import NavBar from "./components/NavBar";
import "./api/axiosDefaults";
import { Route, Switch } from "react-router-dom";
import PostPage from "./pages/Posts/PostPage";
import PostCreateForm from "./pages/Posts/PostCreateForm";
import ProfilePage from "./pages/Profiles/ProfilePage";
import ProfileEditForm from "./pages/Profiles/ProfileEditForm";
import PostEditForm from "./pages/Posts/PostEditForm";
import Container from "react-bootstrap/Container";
import PostsPage from "./pages/Posts/PostsPage";
import styles from "./App.module.css";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import UsernameForm from "./pages/Profiles/UsernameForm";
import UserPasswordForm from "./pages/Profiles/UserPasswordForm";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";
  return (
    <div className={styles.App}>
      <NavBar />
      <Container style={{ paddingTop: "81px" }}>
        <Switch>
          <Route
            exact
            path="/signin"
            render={(props) => <SignInForm {...props} />}
          />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route
            exact
            path="/"
            render={() => (
              <PostsPage message="No results found. Adjust the search keyword." />
            )}
          />
          <Route
            exact
            path="/feed"
            render={() => (
              <PostsPage
                message="No results found. Adjust the search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            )}
          />
          <Route
            exact
            path="/liked"
            render={() => (
              <PostsPage
                message="No results found. Adjust the search keyword or like a post."
                filter={`likes__owner__profile=${profile_id}&`}
              />
            )}
          />
          <Route exact path="/posts/create" render={() => <PostCreateForm />} />
          <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
          <Route exact path="/posts/:id" render={() => <PostPage />} />
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
