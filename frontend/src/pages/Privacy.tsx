import { ArrowLeft, Shield, Lock, Eye, Trash2, Download, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gorilla-500/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-gorilla-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
          <p className="text-dark-400">Lei Geral de Proteção de Dados (LGPD)</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-dark-300">
        <p className="text-sm text-dark-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="p-4 bg-gorilla-500/10 border border-gorilla-500/20 rounded-2xl">
          <p className="text-gorilla-300">
            Esta Política de Privacidade foi elaborada em conformidade com a Lei Federal nº 13.709/2018
            (Lei Geral de Proteção de Dados Pessoais - LGPD) e tem como objetivo informar como coletamos,
            usamos, armazenamos e protegemos seus dados pessoais.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gorilla-500" />
            1. Controlador dos Dados
          </h2>
          <p>
            <strong>Pod Gorillas</strong><br />
            Cidade: Matão - SP<br />
            WhatsApp: (16) 99615-2900<br />
            Instagram: @pod.gorillas
          </p>
          <p className="mt-2">
            Somos responsáveis pelo tratamento dos seus dados pessoais conforme descrito nesta política.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-gorilla-500" />
            2. Dados Pessoais Coletados
          </h2>
          <p>Coletamos os seguintes dados pessoais:</p>

          <div className="mt-4 space-y-4">
            <div className="p-4 bg-dark-800/50 rounded-xl">
              <h4 className="font-semibold text-white mb-2">Dados de Identificação</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nome completo</li>
                <li>Número de telefone/WhatsApp</li>
                <li>E-mail (opcional)</li>
              </ul>
            </div>

            <div className="p-4 bg-dark-800/50 rounded-xl">
              <h4 className="font-semibold text-white mb-2">Dados de Entrega</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Endereço completo (CEP, rua, número, bairro, cidade)</li>
                <li>Complemento e ponto de referência</li>
              </ul>
            </div>

            <div className="p-4 bg-dark-800/50 rounded-xl">
              <h4 className="font-semibold text-white mb-2">Dados de Transação</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Histórico de pedidos</li>
                <li>Valores de compra</li>
                <li>Saldo de cashback</li>
              </ul>
            </div>

            <div className="p-4 bg-dark-800/50 rounded-xl">
              <h4 className="font-semibold text-white mb-2">Dados Técnicos</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Endereço IP</li>
                <li>Dados de navegação</li>
                <li>Informações do dispositivo</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Finalidades do Tratamento</h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Execução de contratos:</strong> Processar pedidos, entregas e pagamentos;</li>
            <li><strong>Comunicação:</strong> Enviar atualizações sobre pedidos via WhatsApp;</li>
            <li><strong>Programa de fidelidade:</strong> Gerenciar seu saldo de cashback;</li>
            <li><strong>Cumprimento legal:</strong> Atender obrigações fiscais e regulatórias;</li>
            <li><strong>Verificação de idade:</strong> Garantir que você é maior de 18 anos;</li>
            <li><strong>Melhoria do serviço:</strong> Analisar padrões de uso para aprimorar nosso site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Base Legal para Tratamento (Art. 7º LGPD)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Consentimento (Art. 7º, I):</strong> Mediante aceite expresso desta política;</li>
            <li><strong>Execução de contrato (Art. 7º, V):</strong> Para processar suas compras;</li>
            <li><strong>Legítimo interesse (Art. 7º, IX):</strong> Para comunicações e melhorias;</li>
            <li><strong>Cumprimento de obrigação legal (Art. 7º, II):</strong> Para verificação de idade e obrigações fiscais.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Compartilhamento de Dados</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Processadores de pagamento:</strong> Para processar transações PIX;</li>
            <li><strong>Serviços de entrega:</strong> Para realizar a entrega do pedido;</li>
            <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial.</li>
          </ul>
          <p className="mt-3 text-gorilla-400">
            <strong>Não vendemos, alugamos ou comercializamos seus dados pessoais.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Armazenamento e Segurança</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Seus dados são armazenados em servidores seguros;</li>
            <li>Utilizamos criptografia para proteger informações sensíveis;</li>
            <li>Senhas são armazenadas com hash seguro (bcrypt);</li>
            <li>Acesso aos dados é restrito a pessoas autorizadas;</li>
            <li>Mantemos logs de acesso para auditoria.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Retenção de Dados</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Dados de conta:</strong> Mantidos enquanto sua conta estiver ativa;</li>
            <li><strong>Dados de transação:</strong> Mantidos por 5 anos para fins fiscais;</li>
            <li><strong>Dados de navegação:</strong> Mantidos por 6 meses;</li>
            <li>Após exclusão da conta, dados são anonimizados ou excluídos em até 30 dias.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gorilla-500" />
            8. Seus Direitos (Art. 18 LGPD)
          </h2>
          <p>Você tem os seguintes direitos sobre seus dados:</p>

          <div className="mt-4 grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-xl">
              <Eye className="w-5 h-5 text-gorilla-500 mt-0.5" />
              <div>
                <strong className="text-white">Acesso</strong>
                <p className="text-sm">Saber quais dados temos sobre você</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-xl">
              <Download className="w-5 h-5 text-gorilla-500 mt-0.5" />
              <div>
                <strong className="text-white">Portabilidade</strong>
                <p className="text-sm">Receber seus dados em formato estruturado</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-xl">
              <Trash2 className="w-5 h-5 text-gorilla-500 mt-0.5" />
              <div>
                <strong className="text-white">Eliminação</strong>
                <p className="text-sm">Solicitar exclusão dos seus dados</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-xl">
              <Lock className="w-5 h-5 text-gorilla-500 mt-0.5" />
              <div>
                <strong className="text-white">Revogação</strong>
                <p className="text-sm">Retirar seu consentimento a qualquer momento</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Cookies e Tecnologias</h2>
          <p>Utilizamos cookies e tecnologias similares para:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Manter sua sessão ativa;</li>
            <li>Lembrar suas preferências;</li>
            <li>Verificação de idade (18+);</li>
            <li>Gerenciar seu carrinho de compras.</li>
          </ul>
          <p className="mt-3">
            Você pode gerenciar cookies nas configurações do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">10. Menores de Idade</h2>
          <p className="text-red-400">
            <strong>Este site não é destinado a menores de 18 anos.</strong>
          </p>
          <p className="mt-2">
            Não coletamos intencionalmente dados de menores. Se tomarmos conhecimento de que
            coletamos dados de um menor, excluiremos imediatamente essas informações.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">11. Alterações nesta Política</h2>
          <p>
            Esta política pode ser atualizada periodicamente. Alterações significativas serão
            comunicadas por meio do site ou WhatsApp. Recomendamos revisar esta página regularmente.
          </p>
        </section>

        <section className="mt-8 p-6 bg-dark-800/50 rounded-2xl border border-dark-700">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-gorilla-500" />
            Exercício de Direitos e Contato
          </h2>
          <p>
            Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-2">
              <strong>WhatsApp:</strong>
              <a href="https://wa.me/5516996152900" className="text-gorilla-400 hover:text-gorilla-300">
                (16) 99615-2900
              </a>
            </li>
            <li><strong>Instagram:</strong> @pod.gorillas</li>
            <li><strong>Prazo de resposta:</strong> Até 15 dias úteis</li>
          </ul>
        </section>

        <section className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
          <h2 className="text-lg font-semibold text-yellow-300 mb-2">Autoridade Nacional de Proteção de Dados</h2>
          <p className="text-yellow-200/80">
            Se você entender que seus direitos não foram adequadamente atendidos, você pode
            apresentar reclamação à ANPD (Autoridade Nacional de Proteção de Dados) através do
            site <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer"
            className="underline">www.gov.br/anpd</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
