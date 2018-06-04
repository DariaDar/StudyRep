package sample;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXMLLoader;
import javafx.geometry.HPos;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.*;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;
import javafx.stage.Window;

import javax.print.DocFlavor;
import java.awt.*;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class Main extends Application {
    public static Stage window;
    Scene login, registration, page, welcome;
    Map<String, String> dictionary = null;

    @Override
    public void start(Stage primaryStage) throws Exception {
        //Parent root = FXMLLoader.load(getClass().getResource("sample.fxml"));
//        primaryStage.setTitle("Welcome");
        //primaryStage.setScene(new Scene(root, 800, 500));
        LoadAccounts();
        window = primaryStage;

        //Label label1 = new Label("Зареєструватися чи увійти.");
        Button button_reg = new Button("Реєстрація");
        button_reg.setPrefHeight(40);
        button_reg.setDefaultButton(true);
        button_reg.setPrefWidth(100);
        button_reg.setOnAction(e -> window.setScene(registration));

        Button button_login = new Button("Увійти");
        button_login.setPrefHeight(40);
        button_login.setDefaultButton(true);
        button_login.setPrefWidth(100);
        button_login.setOnAction(e -> window.setScene(login));

        VBox layout1 = new VBox(20);
        layout1.setAlignment(Pos.CENTER);
        layout1.getChildren().addAll( button_reg, button_login);
        welcome = new Scene(layout1, 800, 500);
        welcome.getStylesheets().add(Main.class.getResource("Welcome.css").toExternalForm());

        GridPane gridPane = createRegistrationFormPane();
        addUIControls(gridPane);
        registration = new Scene(gridPane, 800, 500);
        registration.getStylesheets().add(Main.class.getResource("main.css").toExternalForm());

        GridPane gridPane1 = createRegistrationFormPane();
        addUIControlsLogin(gridPane1);
        login = new Scene(gridPane1, 800, 500);
        login.getStylesheets().add(Main.class.getResource("main.css").toExternalForm());

        // GridPane gridPanePage = createRegistrationFormPane();

        window.setScene(welcome);
        window.setTitle("Таро");
        primaryStage.show();
    }

    private GridPane createRegistrationFormPane() {
        GridPane gridPane = new GridPane();
        gridPane.setAlignment(Pos.CENTER);
        gridPane.setPadding(new Insets(40, 40, 40, 40));
        gridPane.setHgap(10);
        gridPane.setVgap(10);

        ColumnConstraints columnOneConstraints = new ColumnConstraints(100, 100, Double.MAX_VALUE);
        columnOneConstraints.setHalignment(HPos.RIGHT);

        ColumnConstraints columnTwoConstraints = new ColumnConstraints(200, 200, Double.MAX_VALUE);
        columnTwoConstraints.setHgrow(Priority.ALWAYS);

        gridPane.getColumnConstraints().addAll(columnOneConstraints, columnTwoConstraints);

        return gridPane;
    }

    private void addUIControlsLogin(GridPane gridPane) {
        Label headerLabel = new Label("Login Form");
        headerLabel.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        gridPane.add(headerLabel, 0, 0, 2, 1);
        GridPane.setHalignment(headerLabel, HPos.CENTER);
        GridPane.setMargin(headerLabel, new Insets(20, 0, 20, 0));

        Label nameLabel = new Label("Username: ");
        gridPane.add(nameLabel, 0, 1);

        TextField nameField = new TextField();
        nameField.setPrefHeight(40);
        gridPane.add(nameField, 1, 1);

        Label passwordLabel = new Label("Password : ");
        gridPane.add(passwordLabel, 0, 3);

        PasswordField passwordField = new PasswordField();
        passwordField.setPrefHeight(40);
        gridPane.add(passwordField, 1, 3);

        // Add Submit Button
        Button submitButton = new Button("Submit");
        submitButton.setPrefHeight(40);
        submitButton.setDefaultButton(true);
        submitButton.setPrefWidth(100);
        gridPane.add(submitButton, 0, 4, 2, 1);
        GridPane.setHalignment(submitButton, HPos.CENTER);
        GridPane.setMargin(submitButton, new Insets(20, 0, 20, 0));

        submitButton.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                if (nameField.getText().isEmpty()) {
                    showAlert(Alert.AlertType.ERROR, gridPane.getScene().getWindow(), "Form Error!", "Please enter your name");
                    return;
                } else if (passwordField.getText().isEmpty()) {
                    showAlert(Alert.AlertType.ERROR, gridPane.getScene().getWindow(), "Form Error!", "Please enter a password");
                    return;
                }
                if(!dictionary.containsKey(nameField.getText())) {
                    System.out.println(dictionary.keySet());
                    showAlert(Alert.AlertType.ERROR, gridPane.getScene().getWindow(), "Form Error!", "This User doesn't exist!");
                    return;
                }
                else if(!dictionary.get(nameField.getText()).equals(passwordField.getText()) ){
                    showAlert(Alert.AlertType.ERROR, gridPane.getScene().getWindow(), "Form Error!", "Wrong password");
                    return;
                }

                showAlert(Alert.AlertType.CONFIRMATION, gridPane.getScene().getWindow(), "Login Successful!", "Welcome, " + nameField.getText());
                GetPage(nameField.getText());
            }
        });
    }

    private void GetPage(String name) {
//        GridPane gridPane = new GridPane();
//        addUIControlsPage(gridPane, name);

        try {
            Parent root = FXMLLoader.load(getClass().getResource("FXMLDocument.fxml"));
            page = new Scene(root);
            window.setScene(page);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    private void addUIControlsPage(GridPane gridPane, String name) {
        Label headerLabel = new Label("Вітаємо, " + name);
        headerLabel.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        headerLabel.setContentDisplay(ContentDisplay.TOP);
        gridPane.add(headerLabel, 0, 0, 2, 1);
    }

    private void addUIControls(GridPane gridPane) {
        Label headerLabel = new Label("Registration Form");
        headerLabel.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        gridPane.add(headerLabel, 0, 0, 2, 1);
        GridPane.setHalignment(headerLabel, HPos.CENTER);
        GridPane.setMargin(headerLabel, new Insets(20, 0, 20, 0));

        Label nameLabel = new Label("Username: ");
        gridPane.add(nameLabel, 0, 1);

        TextField nameField = new TextField();
        nameField.setPrefHeight(40);
        gridPane.add(nameField, 1, 1);

//        Label emailLabel = new Label("Email : ");
//        gridPane.add(emailLabel, 0, 2);
//
//        TextField emailField = new TextField();
//        emailField.setPrefHeight(40);
//        gridPane.add(emailField, 1, 2);

        Label passwordLabel = new Label("Password : ");
        gridPane.add(passwordLabel, 0, 3);

        PasswordField passwordField = new PasswordField();
        passwordField.setPrefHeight(40);
        gridPane.add(passwordField, 1, 3);

        // Add Submit Button
        Button submitButton = new Button("Submit");
        submitButton.setPrefHeight(40);
        submitButton.setDefaultButton(true);
        submitButton.setPrefWidth(100);
        gridPane.add(submitButton, 0, 4, 2, 1);
        GridPane.setHalignment(submitButton, HPos.CENTER);
        GridPane.setMargin(submitButton, new Insets(20, 0, 20, 0));

        submitButton.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                if (nameField.getText().isEmpty()) {
                    showAlert(Alert.AlertType.ERROR, gridPane.getScene().getWindow(), "Form Error!", "Please enter your name");
                    return;
                } else if (passwordField.getText().isEmpty()) {
                    showAlert(Alert.AlertType.ERROR, gridPane.getScene().getWindow(), "Form Error!", "Please enter a password");
                    return;
                }
                if (dictionary.containsKey(nameField.getText())) {
                    showAlert(Alert.AlertType.ERROR, gridPane.getScene().getWindow(), "Form Error!", "This Username has already existed. Please, choose another one.");
                    return;
                }
                Registration(nameField, passwordField);

                showAlert(Alert.AlertType.CONFIRMATION, gridPane.getScene().getWindow(), "Registration Successful!", "Welcome " + nameField.getText());
                GetPage(nameField.getText());
            }
        });

    }

    private void Registration(TextField name, PasswordField password) {
        String pname = name.getText();
        String pass = password.getText();
        dictionary.put(pname, pass);
        WriteAccounts();
    }

    private void LoadAccounts() {
        dictionary = new HashMap<String, String>();

        if (new File("accounts.txt").exists()) {
            FileInputStream fis = null;
            ObjectInputStream ois = null;
            try {
                fis = new FileInputStream("accounts.txt");
                ois = new ObjectInputStream(fis);

                dictionary = (Map<String, String>) ois.readObject();

			    /*
			    if(dictionary.size() > 0){
			    	Iterator<Map.Entry<String, String>> itr = db.entrySet().iterator();
			    	while (itr.hasNext()){
			    	    System.out.println(itr.next().toString());
			    	}
			    }*/

            } catch (FileNotFoundException e) {
                System.err.println(e.getMessage());
            } catch (IOException e) {
                System.err.println(e.getMessage());
            } catch (ClassNotFoundException e) {
                System.err.println("Не удалось произвести чтение из файла. Файл не найден.");
                //System.err.println(e.getMessage());
            } finally {
                if (ois != null) {
                    try {
                        ois.close();
                    } catch (IOException e) {
                    }
                }
                if (fis != null) {
                    try {
                        fis.close();
                    } catch (IOException e) {
                    }
                }
            }
        }

    }

    private void WriteAccounts() {
        FileOutputStream fos = null;
        ObjectOutputStream oos = null;

        try {
            fos = new FileOutputStream("accounts.txt");
            oos = new ObjectOutputStream(fos);

            oos.writeObject(dictionary);
            System.out.println("Запись в файл произведена!");

        } catch (FileNotFoundException e) {
            System.err.println(e.getMessage());
        } catch (IOException e) {
            System.err.println(e.getMessage());
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                }
            }
            if (oos != null) {
                try {
                    oos.close();
                } catch (IOException e) {
                }
            }
        }
    }

    private void showAlert(Alert.AlertType alertType, Window owner, String title, String message) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        owner.getScene().getStylesheets().add(Main.class.getResource("sample.css").toExternalForm());
        alert.initOwner(owner);
        alert.show();
    }

    private void Scene2() {

    }


    public static void main(String[] args) {
        launch(args);
    }
}
