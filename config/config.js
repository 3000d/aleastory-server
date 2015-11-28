module.exports = {
  ENVIRONMENT: process.env.ENVIRONMENT || "development",
  HTTP_PORT: process.env.HTTP_PORT || 8081,
  DRY_RUN: process.env.DRY_RUN || false,

  PRINTER_SERIAL_PORT: process.env.PRINTER_SERIAL_PORT || '/dev/ttyAMA0',
  PRINTER_SERIAL_BAUDRATE: process.env.PRINTER_SERIAL_BAUDRATE || 19200,

  BUTTON_PIN: process.env.BUTTON_PIN || 21,
  BUTTON_COOL_OFF_DELAY: 1000,

  LED_GREEN_PIN: process.env.LED_GREEN_PIN || 14,
  LED_RED_PIN: process.env.LED_RED_PIN || 15,

  isDebug: function() {
    return this.ENVIRONMENT == "development";
  }
};