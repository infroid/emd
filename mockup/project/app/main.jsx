// main.jsx — screen registry + mount. Loaded last.

window.SCREENS = {
  // auth
  splash:       { comp: ScreenSplash },
  login:        { comp: ScreenLogin },
  signup:       { comp: ScreenSignup },
  otp:          { comp: ScreenOtp },

  // tab roots (persistent bottom bar)
  home:         { comp: ScreenHome,    tab: 'home',    tabs: true },
  ehr:          { comp: ScreenEhr,     tab: 'records', tabs: true },
  sos:          { comp: ScreenSos,     tab: 'sos',     tabs: true },
  doctors:      { comp: ScreenDoctors, tab: 'doctors', tabs: true },
  profile:      { comp: ScreenProfile, tab: 'profile', tabs: true },

  // sos
  sosActive:    { comp: ScreenSosActive, bleed: true },
  contacts:     { comp: ScreenContacts },
  medical:      { comp: ScreenMedical },

  // ehr
  catDetail:    { comp: ScreenCat },
  labDetail:    { comp: ScreenLabDetail },
  upload:       { comp: ScreenUpload },
  share:        { comp: ScreenShare },
  anatomy:      { comp: ScreenAnatomy },
  organ:        { comp: ScreenOrgan, bleed: true },

  // doctor
  docProfile:   { comp: ScreenDocProfile },
  booking:      { comp: ScreenBooking },
  bookingDone:  { comp: ScreenBookingDone },
  video:        { comp: ScreenVideoCall, bleed: true, dark: true },
  chat:         { comp: ScreenChat },
  appointments: { comp: ScreenAppointments },

  // meds + diet
  rx:           { comp: ScreenRx },
  rxDetail:     { comp: ScreenRxDetail },
  dietSheet:    { comp: ScreenDietSheet },

  // profile / settings
  account:      { comp: ScreenAccount },
  family:       { comp: ScreenFamily },
  insurance:    { comp: ScreenInsurance },
  notifPrefs:   { comp: ScreenNotifPrefs },
  language:     { comp: ScreenLanguage },
  privacy:      { comp: ScreenPrivacy },
  notifications:{ comp: ScreenNotifications },
};

window.INITIAL_SCREEN = 'splash';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
