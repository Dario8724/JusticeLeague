package pt.app.JusticeLeague.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Envia um email de texto simples.
     */
    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("SafeNet <noreply@safenet.pt>");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    /**
     * Envia um email em formato HTML.
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(htmlBody, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("SafeNet <noreply@safenet.pt>");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Falha ao enviar email HTML", e);
        }
    }

    // Template de Boas-vindas
    public void sendWelcomeEmail(String to, String nome) {
        String subject = "Bem-vindo ao SafeNet!";
        String body = "Olá " + nome + ",\n\n" +
                "Obrigado por se registar no SafeNet - Plataforma de Denúncias de Crimes Informáticos.\n" +
                "A sua conta foi criada com sucesso e já pode submeter denúncias de forma segura e rápida.\n\n" +
                "Atenciosamente,\n" +
                "Equipa SafeNet";
        sendSimpleEmail(to, subject, body);
    }

    // Template de Atualização de Denúncia
    public void sendDenunciaUpdateEmail(String to, Long denunciaId, String novoEstado) {
        String subject = "Atualização da Denúncia #" + denunciaId;
        String body = "Olá,\n\n" +
                "Informamos que o estado da sua denúncia #" + denunciaId + " foi alterado para: " + novoEstado + ".\n" +
                "Pode consultar os detalhes e trocar mensagens com o agente responsável no seu painel pessoal.\n\n" +
                "Atenciosamente,\n" +
                "Equipa SafeNet";
        sendSimpleEmail(to, subject, body);
    }
}
