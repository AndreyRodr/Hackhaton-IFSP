const { addOng, login: loginOng, validacao: validarSenhaOng } = require("../model/cadastroOng");

class OngController {
    
    // Renderiza a página de login de ONG
    async loginPage(req, res) {
        res.render("loginOng", { erro: null });
    }

    // Renderiza a página de cadastro de ONG
    async cadastroPage(req, res) {
        res.render("cadastroOng", { erro: null });
    }

    // Processa o Login de ONG
    async autenticar(req, res) {
        const { email, senha } = req.body;
        try {
            const ong = await loginOng(email);
            
            // Verifica se a ONG existe e se a senha bate
            if (ong && await validarSenhaOng(senha, ong.senha)) {
                // Salva a ONG na sessão
                req.session.user = {
                    nome: ong.nome,
                    email: ong.email,
                    tipo: 'ong'
                };
                
                req.flash('success', 'Login de ONG efetuado com sucesso.');
                return res.redirect("/home");
            }
            
            req.flash('error', 'E-mail ou senha inválidos.');
            res.redirect("/login-ong");
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao processar login da ONG. Tente novamente.');
            res.redirect("/login-ong");
        }
    }

    // Processa o Cadastro de ONG
    async cadastrar(req, res) {
        const { nome, email, senha, categoria, descricao } = req.body;
        
        try {
            // Valida se todos os campos obrigatórios foram preenchidos
            if (!nome || !email || !senha || !categoria || !descricao) {
                req.flash('error', 'Preencha todos os campos da ONG.');
                return res.redirect('/cadastro-ong');
            }

            // Cria a ONG (o hook no model cuida da senha)
            await addOng({
                nome,
                email,
                senha,
                categoria,
                descricao,
                tipo_conta: "ong"
            });

            req.flash('success', 'Cadastro de ONG realizado com sucesso. Faça login.');
            res.redirect("/login-ong");
        } catch (error) {
            console.error(error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                req.flash('error', 'Este e-mail já está cadastrado.');
            } else {
                req.flash('error', 'Erro ao cadastrar ONG. Tente novamente.' + error.name);
            }
            res.redirect('/cadastro-ong');
        }
    }

    // Logout
    async sair(req, res) {
        req.session.destroy(() => {
            res.redirect("/");
        });
    }
}

module.exports = new OngController();