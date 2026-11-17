#include <Arduino.h>

// Štartovací kód pre ukážku – ZÁMERNE jednoduchý a s chybami v štýle.
// Úloha pre Claude Code: prepísať na millis(), pridať debounce a režimy LED.

void setup() {
  pinMode(9, OUTPUT);
  pinMode(2, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(2) == LOW) {
    Serial.println("Tlacidlo stlacene");
    digitalWrite(9, HIGH);
    delay(500);
    digitalWrite(9, LOW);
    delay(500);
  }
}
