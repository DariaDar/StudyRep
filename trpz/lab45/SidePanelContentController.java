package sample;


import com.jfoenix.controls.JFXButton;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Scene;
import javafx.scene.layout.AnchorPane;


public class SidePanelContentController implements Initializable {

    @FXML
    private JFXButton b1;
    @FXML
    private JFXButton b2;
    @FXML
    private JFXButton b3;
    @FXML
    private JFXButton exit;

    @FXML
    private AnchorPane root;

    @Override
    public void initialize(URL url, ResourceBundle rb) {

    }

    @FXML
    private void changeColor(ActionEvent event) throws IOException {
        JFXButton btn = (JFXButton) event.getSource();
        System.out.println(btn.getText());
        switch(btn.getText())
        {
            case "Календар":FXMLDocumentController.rootP.setStyle("-fx-background-color:#00FF00");
                break;
            case "Список карт":FXMLDocumentController.rootP.setStyle("-fx-background-color:lightblue");
//                root = FXMLLoader.load(getClass().getResource("Сards.fxml"));
//                Scene scene = new Scene(root);
//                Main.window.setScene(scene);
                break;
            case "Мої розклади":FXMLDocumentController.rootP.setStyle("-fx-background-color:#FF0000");
                break;
            case "Мої трактування":FXMLDocumentController.rootP.setStyle("-fx-background-color:yellow");
                break;
            case "Список розкладів":FXMLDocumentController.rootP.setStyle("-fx-background-color:beige");
                break;
        }
    }

    @FXML
    private void exit(ActionEvent event) {
        System.exit(0);
    }

}
