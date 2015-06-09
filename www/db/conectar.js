
var criarTabela = 'CREATE TABLE IF NOT EXISTS ';

function prepareDatabase() {
    var db = openDatabase('clazzmanager', '1.3', 'Base do ClazzManager', 5 * 1024 * 1024);
    db.transaction(function(t) {
        t.executeSql(criarTabela + 'Tipo_Arquivo(codigo    Integer primary key autoincrement, '+
                                                 'tipo      Varchar(50),  '+
                                                 'descricao Varchar(50))');
        
        t.executeSql(criarTabela + 'Anotacao(codigo Integer primary key autoincrement, titulo Text,descricao Text, data_cadastro Text, data_publicacao Text, Anotacao_Arquivo_codigo Integer, Pessoa_codigo Integer, FOREIGN KEY (Pessoa_codigo) REFERENCES Pessoa (codigo))');  

        t.executeSql(criarTabela + 'Anotacao_Arquivo(' +
                'codigo Integer primary key autoincrement,' +
                'nome_arquivo        Text,' +
                'link_arquivo        Text,' +
                'data_hora           Text,' +
                'Tipo_Arquivo_codigo Integer,' +
                'FOREIGN KEY (Tipo_Arquivo_codigo) REFERENCES Tipo_Arquivo (codigo))');  
        
    
        t.executeSql(criarTabela + 'Pessoa_Tipo(codigo INTEGER PRIMARY KEY AUTOINCREMENT,  '+
                                    'tipo TEXT NOT NULL)'
        );
        
        t.executeSql(criarTabela + 'Tipo_Turma(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                               'descricao TEXT NOT NULL)'
        );
        
        t.executeSql(criarTabela + 'Curso(codigo INTEGER PRIMARY KEY AUTOINCREMENT,  '+
                                          'descricao TEXT NOT NULL)'
        );
    
        t.executeSql(criarTabela + 'Sala(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                         'descricao TEXT NOT NULL)'
        );
    
        t.executeSql(criarTabela + 'Disciplina(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                               'descricao TEXT NOT NULL)');
    
        t.executeSql(criarTabela + 'Login(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                          'usuario TEXT NOT NULL, '+
                                          'senha TEXT NOT NULL)');
    
        t.executeSql(criarTabela + 'Midia(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                          'tipo TEXT NOT NULL, '+
                                          'descricao TEXT NOT NULL)');
    
        t.executeSql(criarTabela + 'Turno(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                          'descricao TEXT NOT NULL, '+
                                          'horaInicio TEXT NOT NULL, '+
                                          'horaTermino TEXT NOT NULL)');
    
        t.executeSql(criarTabela + 'Avaliacao(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                              'descricao TEXT NOT NULL, '+
                                              'dataHora TEXT NOT NULL)');
    
        t.executeSql(criarTabela + 'Contato(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                            'tipoDeContato TEXT NOT NULL, '+
                                            'DescricaoContato TEXT NOT NULL)');
    
        t.executeSql(criarTabela + 'Aula(codigo INTEGER PRIMARY KEY AUTOINCREMENT,data TEXT NOT NULL,descricao TEXT NOT NULL,horaInicio TEXT NOT NULL,horaFim TEXT NOT NULL)');
    
        t.executeSql(criarTabela + 'Comentario(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                               'aula_codigo INTEGER NOT NULL, '+
                                               'descricao TEXT NOT NULL, '+
                                               'dataHora TEXT NULL, '+
                                               'FOREIGN KEY (aula_codigo) REFERENCES Aula (codigo))');
 
        t.executeSql(criarTabela + 'Pessoa(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                           'pessoa_Tipo INTEGER NOT NULL, '+
                                           'contato_codigo INTEGER, '+
                                           'login_codigo INTEGER, '+
                                           'nome TEXT NOT NULL, '+
                                           'dataNascimento TEXT NOT NULL, '+
                                           'genero TEXT, '+
                                           'situacao TEXT NOT NULL, '+
                                           'nivelAcesso INTEGER, '+
                                           'foto BLOB, '+
                                           'FOREIGN KEY ( Pessoa_Tipo ) REFERENCES Pessoa_Tipo ( codigo ), '+
                                           'FOREIGN KEY ( contato_codigo ) REFERENCES Contato ( codigo ), '+
                                           'FOREIGN KEY ( login_codigo ) REFERENCES Login ( codigo ))');
    
        t.executeSql(criarTabela + 'Turma(codigo INTEGER PRIMARY KEY NOT NULL, '+
                                          'turno INTEGER NOT NULL, '+
                                          'professor INTEGER NOT NULL, '+
                                          'tipo_Turma INTEGER NOT NULL, '+
                                          'curso INTEGER NOT NULL, '+
                                          'sala INTEGER NOT NULL, '+
                                          'serie TEXT NOT NULL, '+
                                          'dataInicio TEXT NOT NULL, '+
                                          'dataFim TEXT NOT NULL, '+
                                          'FOREIGN KEY ( Turno ) REFERENCES Turno ( codigo ), '+
                                          'FOREIGN KEY ( Professor ) REFERENCES Pessoa ( codigo ), '+
                                          'FOREIGN KEY ( Tipo_Turma ) REFERENCES Tipo_Turma ( codigo ), '+
                                          'FOREIGN KEY ( Curso ) REFERENCES Curso ( codigo ), '+
                                          'FOREIGN KEY ( Sala ) REFERENCES Sala ( codigo ))');
    
        t.executeSql(criarTabela + 'Diario_Classe(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                                  'aula INTEGER NOT NULL, '+
                                                  'descricao TEXT NOT NULL, '+
                                                  'FOREIGN KEY ( Aula ) REFERENCES Aula ( codigo ))');
    
        t.executeSql(criarTabela + 'Presenca(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                             'aula INTEGER NOT NULL, '+
                                             'pessoa INTEGER NOT NULL, '+
                                             'dataHora TEXT NULL, '+
                                             'situacao TEXT NULL, '+
                                             'observacao TEXT NULL, '+
                                             'FOREIGN KEY ( Aula ) REFERENCES Aula ( codigo ),  '+
                                             'FOREIGN KEY ( Pessoa ) REFERENCES Pessoa ( codigo ))');
    
        t.executeSql(criarTabela + 'Nota(codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                         'pessoa INTEGER NOT NULL, '+
                                         'avaliacao INTEGER NOT NULL, '+
                                         'diario_Classe INTEGER NOT NULL, '+
                                         'nota TEXT NOT NULL, '+
                                         'dataHora TEXT NULL, '+
                                         'FOREIGN KEY ( Pessoa ) REFERENCES Pessoa ( codigo ), '+
                                         'FOREIGN KEY ( Avaliacao ) REFERENCES Avaliacao ( codigo ), '+
                                         'FOREIGN KEY ( Diario_Classe ) REFERENCES Diario_Classe ( codigo ))');
    
       t.executeSql(criarTabela + 'Material( codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                             'midia_codigo INTEGER NOT NULL, '+
                                             'aula_codigo INTEGER NOT NULL, '+
                                             'comentario INTEGER NOT NULL, '+
                                             'descricao TEXT NOT NULL,conteudo TEXT NOT NULL, '+
                                             'dataHora TEXT NULL, '+
                                             'FOREIGN KEY ( Midia_codigo ) REFERENCES Midia ( codigo ), '+
                                             'FOREIGN KEY ( Aula_codigo ) REFERENCES Aula ( codigo ), '+
                                             'FOREIGN KEY ( Comentario ) REFERENCES Comentario ( codigo ))');
    
        t.executeSql(criarTabela + 'Disciplina_Turma(disciplina INTEGER NOT NULL, '+
                                                     'turma INTEGER NOT NULL,PRIMARY KEY ( disciplina , turma ), '+
                                                     'FOREIGN KEY ( Disciplina ) REFERENCES Disciplina ( codigo ), '+
                                                     'FOREIGN KEY ( Turma ) REFERENCES Turma ( codigo ))');
    
        t.executeSql(criarTabela + 'Pessoa_Turma(pessoa_codigo INTEGER PRIMARY KEY AUTOINCREMENT, '+
                                                 'turma_codigo INTEGER NOT NULL, '+
                                                 'FOREIGN KEY ( Pessoa_codigo ) REFERENCES Pessoa(codigo), '+
                                                 'FOREIGN KEY ( Turma_codigo ) REFERENCES Turma ( codigo ))');
    
        
    t.executeSql("insert into Tipo_Arquivo(tipo, descricao) values ('JPEG', 'Documento de imagem .JPEG')");    
    t.executeSql("insert into Pessoa_Tipo(tipo) values ('aluno')");
    t.executeSql("insert into Pessoa_Tipo(tipo) values ('professor')");
    t.executeSql("insert into Tipo_Turma(descricao) values ('turma regular')"); 
    t.executeSql("insert into Curso(descricao) values ('Sistemas de informação')"); 
    t.executeSql("insert into Sala(descricao) values ('Bloco E2')"); 
    t.executeSql("insert into Disciplina(descricao) values ('Matemática')"); 
    t.executeSql("insert into Login(usuario, senha) values ('rian', '1234')");
    t.executeSql("insert into Midia(tipo, descricao) values ('video', 'www.youtube.com.br')");
    t.executeSql("insert into Turno(descricao, horaInicio, horaTermino) values ('Noturno', '19:00:00', '23:00:00')");  
    t.executeSql("insert into Avaliacao(descricao, dataHora) values ('Prova A1', '07/10/2015 19:00:00')");
    t.executeSql("insert into Contato (tipoDeContato, DescricaoContato) values ('email', 'rian.perassoli@gmail,com')");
    t.executeSql("insert into Aula (data, descricao, horaInicio, horaFim) values ('07/10/2015', 'aula a noite', '19:00:00', '23:00:00')");
    t.executeSql("insert into Comentario(aula_codigo, descricao, dataHora) values (1, 'Video bom', '06/10/2014 22:01:00')");
    t.executeSql("insert into Pessoa (pessoa_Tipo, contato_codigo, login_codigo, nome, dataNascimento, genero, situacao, nivelAcesso) values (1, 1, 1, 'Rian', '1992-06-03', 'M', 'ativo', 3)");
    t.executeSql("insert into Turma (turno, professor, tipo_Turma, curso, sala, serie, dataInicio, dataFim) values (1, 1, 1, 1, 1, '3ª', '06/10/2014', '06/10/2015')");
    t.executeSql("insert into Diario_classe (aula, descricao) values (1, 'turma bla teste')");
    t.executeSql("insert into Presenca (aula, pessoa, dataHora, situacao, observacao) values (1, 1, '07/10/2015 19:00:00', 'Presente', 'ok')");
    t.executeSql("insert into Nota (pessoa, avaliacao, diario_Classe, nota, dataHora) values (1, 1, 1, '9.2', '07/10/2015 19:00:00')");
    t.executeSql("insert into Material (midia_codigo, aula_codigo, comentario, descricao, conteudo, dataHora) values (1, 1, 1, 'livro digital', 'teset','07/10/2015 19:00:00')");
    t.executeSql("insert into Disciplina_Turma (disciplina, turma) values (1, 1)");
    t.executeSql("insert into Pessoa_Turma (pessoa_codigo, turma_codigo) values (1, 1)"); 
         
            
    });
    
    return db;
}