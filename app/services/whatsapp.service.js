"use strict";

const {
  default: makeWALegacySocket,
  useSingleFileAuthState,
  DisconnectReason,
} = require("@adiwajshing/baileys");
const { throws } = require("assert");
const { on } = require("events");
const fs = require("fs");
const dotenv = require("dotenv");
const pino = require("pino");
const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});
const newLogger = pino();
newLogger.level = "silent";
dotenv.config();

let session = `${process.env.SEASSION_WA_NAME}.json`;

const { state, saveState } = useSingleFileAuthState(session);

class WhatsappService {
  conn;
  connectionStatus = "close";
  qrCode = "";
  isLogin = false;

  constructor() {
    this.createWhatsapp();
  }

  destroy() {
    console.log("Connection destroyed");
    this.conn = null;
  }

  createWhatsapp() {
    logger.info("Whatsapp service started....");

    this.conn = makeWALegacySocket({
      printQRInTerminal: false,
      auth: state,
      browser: ["KulkasExpress", "Chrome", "4.0.0"],
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 20000,
      logger: newLogger,
    });
    this.conn.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr, isNewLogin } = update;
      this.qrCode = qr;
      if (typeof connection !== "undefined" && connection) {
        logger.info(connection);
        this.connectionStatus = connection;
      }
      if (connection === "close") {
        logger.error("Whatsapp.js ==> close");
        const shouldReconnect =
          lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
        // reconnect if not logged out
        if (shouldReconnect) {
          console.log("Whatsapp Service ==> Needed restart!");
          this.createWhatsapp();
        }
        if (!shouldReconnect) {
          fs.unlink(session);
        }
      }
    });

    this.conn.ev.on("creds.update", (data) => {
      if (data.registrationId == null) {
        this.isLogin = true;
      }
    });
  }
}

module.exports = WhatsappService;
