from PyQt5.QtWidgets import (
    QDialog, QDateEdit, QDialogButtonBox, QLayout,
    QLabel, QFormLayout
)
from PyQt5.QtGui import QKeyEvent, QCloseEvent
from PyQt5.QtCore import pyqtSignal, Qt 

from sys import exit
from datetime import date

from typing import List
import requests

from srvrcfg import SERVERURL

DATE = date.today()

class GetHistoryDialog(QDialog):
    invalid = pyqtSignal()
    def __init__(self, parent =None):
        super().__init__(parent=parent)
        self.setWindowTitle("History")

        if parent:
            parent.setDisabled(True)
            self.setEnabled(True)

        self.setWindowFlag(Qt.WindowContextHelpButtonHint, False)
        buttonBox = QDialogButtonBox(QDialogButtonBox.Ok, self)
        

        self.start = QDateEdit()
        self.start.setDate(DATE)
        self.end = QDateEdit()
        self.end.setDate(DATE)
        self.startLabel = QLabel()
        self.endLabel = QLabel()
        self.startLabel.setText("From:")
        self.endLabel.setText("To:")

        layout = QFormLayout(self)
        layout.addRow(self.startLabel, self.start)
        layout.addRow(self.endLabel, self.end)
        layout.addWidget(buttonBox)

        self.layout().setSizeConstraint(QLayout.SetFixedSize)

        buttonBox.accepted.connect(self.getHistory)

    def getHistory(self):
        if (start:=self.start.date().toPyDate()) > DATE or (end:=self.end.date().toPyDate()) > DATE or start > end:
            self.parent().error("Provide valid range of Dates")
            return

        start = self.start.date().toString("dd-MM-yyyy")
        end = self.end.date().toString("dd-MM-yyyy")

        from webbrowser import open as open_in_browser
        open_in_browser(f"{SERVERURL}/get_issued_passes?based_on=date&ret_type=csv&from={start}&to={end}") 
        # open_in_browser("https://google.co.in")
        self.parent().success("CSV Download started in browser.")
        self.close()


    def closeEvent(self, a0: QCloseEvent) -> None:
        if self.parent():
            self.parent().setEnabled(True)
        return super().closeEvent(a0)
    
    def keyPressEvent(self, e: QKeyEvent) -> None:
        if e.key() != Qt.Key.Key_Escape:
            QDialog.keyPressEvent(self, e)

