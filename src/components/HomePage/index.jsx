import React, { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../AuthProvider";
import app from "../../firebase";
import { useWindowSize } from "react-use";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { ReactComponent as Stopwatch } from "../../assets/stopwatch.svg";
import {v4 as uuidv4} from 'uuid';


const database = app.database(process.env.REACT_APP_DATABASE_URL);

const HomePage = () => {
  const currentUser = useContext(AuthContext);
  const { width } = useWindowSize();
  const [desktopTime, setDesktopTime] = useState(null);
  const [desktopTimeSec, setDesktopTimeSec] = useState(null);
  const [desktopTimeMin, setDesktopTimeMin] = useState(null);
  const [desktopTimeHour, setDesktopTimeHour] = useState(null);
  const [mobileTime, setMobileTime] = useState(null);
  const [mobileTimeSec, setMobileTimeSec] = useState(null);
  const [mobileTimeMin, setMobileTimeMin] = useState(null);
  const [mobileTimeHour, setMobileTimeHour] = useState(null);
  const [isMobileVersion, setIsMobileVersion] = useState(false);
  const [isTimeRunning, setIsTimeRunning] = useState(null);
  const interval = useRef(null);

  useEffect(() => {
    setDesktopTimeSec(pad(desktopTime % 60));
    setDesktopTimeMin(pad(parseInt(desktopTime / 60)));
    setMobileTimeSec(pad(mobileTime % 60));
    setMobileTimeMin(pad(parseInt(mobileTime / 60)));
  }, [desktopTime, mobileTime]);

  useEffect(() => {
    setDesktopTimeHour(pad(parseInt(desktopTimeMin / 60)));
    setMobileTimeHour(pad(parseInt(mobileTimeMin / 60)));
  }, [desktopTimeMin, mobileTimeMin]);

  function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  useEffect(() => {
    const setWindowInner = () => {
      width < 500 ? setIsMobileVersion(true) : setIsMobileVersion(false);
    };
    setWindowInner();
  }, [width]);

  const onLogOut = () => {
    clearInterval(interval.current);
    interval.current = null;
    database
      .ref(
        `user/${currentUser.uid}/${
          isMobileVersion ? "mobileTime" : "desktopTime"
        }Running`
      )
      .set(false);
    if(sessionStorage.getItem('sessionId')) {
      database.ref(`user/${currentUser.uid}/sessionId`).remove();
    }
    app.auth().signOut();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      database
        .ref(
          `user/${currentUser.uid}/${
            isMobileVersion ? "mobileTime" : "desktopTime"
          }Running`
        )
        .set(false);

        if(sessionStorage.getItem('sessionId')) {
          database.ref(`user/${currentUser.uid}/sessionId`).remove();
        }
    });
  }, []);

  useEffect(() => {
    database
    .ref(
      `user/${currentUser.uid}/${
        isMobileVersion ? "mobileTime" : "desktopTime"
      }Running`
    )
    .once("value")
    .then((snapshot) => {
      setIsTimeRunning(snapshot.val());
    })
  }, [currentUser, isMobileVersion])

  useEffect(() => {
    const sessionId = uuidv4();
    database.ref(`user/${currentUser.uid}/sessionId`).once("value").then((snapshot) => {
      if(!snapshot.val() && sessionStorage.getItem(sessionId) === null) {
        sessionStorage.setItem('sessionId', sessionId);
        database.ref(`user/${currentUser.uid}/sessionId`).set(sessionId);

        database
        .ref(
          `user/${currentUser.uid}/${
            isMobileVersion ? "mobileTime" : "desktopTime"
          }`
        )
        .once("value")
        .then((snapshot) => {
          const timeInSeconds = snapshot.val();
  
  
          database
            .ref(
              `user/${currentUser.uid}/${
                isMobileVersion ? "mobileTime" : "desktopTime"
              }Running`
            )
            .set(true);
  
  
          return functionTimer(timeInSeconds, (elapsedTime) => {
            database
              .ref(
                `user/${currentUser.uid}/${
                  isMobileVersion ? "mobileTime" : "desktopTime"
                }`
              )
              .set(elapsedTime);
            isMobileVersion
              ? setMobileTime(elapsedTime)
              : setDesktopTime(elapsedTime);
          })
            .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
            .catch((error) => console.error(error));
        });
      } else {
        database
              .ref(
                `user/${currentUser.uid}/${
                  isMobileVersion ? "mobileTime" : "desktopTime"
                }`
              ).on('value' ,(s) => {
                isMobileVersion
                ? setMobileTime(s.val())
                : setDesktopTime(s.val());

              })
      }
    })
  }, [currentUser, isMobileVersion, isTimeRunning]);

  function functionTimer(seconds, call) {
    return new Promise(() => {
      interval.current = setInterval(onInterval, 1000);
      let elapsedSeconds = 0;

      function onInterval() {
        call(seconds + elapsedSeconds);
        elapsedSeconds++;
      }
    });
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      p={4}
      flexWrap="wrap"
    >
      <Box display="flex" justifyContent="flex-end" width={1}>
        <Button variant="contained" color="secondary" onClick={onLogOut}>
          Log Out
        </Button>
      </Box>
      <Box display="flex" mb={4}>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography variant="h3" gutterBottom>
            Desktop
          </Typography>
          <Stopwatch />
          <Box mt={2}>
            {desktopTimeHour}:{desktopTimeMin}:{desktopTimeSec}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography variant="h3" gutterBottom>
            Mobile
          </Typography>
          <Stopwatch />
          <Box mt={2}>
            {mobileTimeHour}:{mobileTimeMin}:{mobileTimeSec}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
