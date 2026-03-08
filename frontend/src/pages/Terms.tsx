import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>

      <div className="prose prose-invert max-w-none space-y-6 text-dark-300">
        <p className="text-sm text-dark-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar o site da Pod Gorillas, você concorda com estes Termos de Uso.
            Se você não concordar com qualquer parte destes termos, não deve utilizar nosso site ou serviços.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Restrição de Idade</h2>
          <p>
            <strong className="text-red-400">IMPORTANTE:</strong> Este site destina-se exclusivamente a maiores de 18 anos.
            Ao utilizar nosso site, você declara e garante que:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Tem 18 anos de idade ou mais;</li>
            <li>Possui capacidade legal para celebrar contratos vinculativos;</li>
            <li>Não está proibido por lei de adquirir produtos de cigarro eletrônico;</li>
            <li>Compreende os riscos associados ao uso de produtos contendo nicotina.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Produtos e Serviços</h2>
          <p>
            A Pod Gorillas comercializa dispositivos eletrônicos de vaporização (PODs) e acessórios relacionados.
            Nossos produtos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>São destinados exclusivamente para uso por adultos fumantes ou usuários de nicotina;</li>
            <li>Podem conter nicotina, substância que causa dependência;</li>
            <li>Não são produtos terapêuticos para parar de fumar;</li>
            <li>Não devem ser utilizados por não-fumantes, menores de idade, grávidas ou lactantes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Cadastro e Conta</h2>
          <p>
            Ao criar uma conta em nosso site, você se compromete a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fornecer informações verdadeiras, precisas e completas;</li>
            <li>Manter suas credenciais de acesso em sigilo;</li>
            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta;</li>
            <li>Ser responsável por todas as atividades realizadas em sua conta.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Preços e Pagamento</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Os preços são expressos em Reais (BRL) e podem ser alterados sem aviso prévio;</li>
            <li>Aceitamos pagamento via PIX;</li>
            <li>O pedido só será processado após confirmação do pagamento;</li>
            <li>Oferecemos sistema de cashback para clientes cadastrados (conforme regras vigentes).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Entrega</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Realizamos entregas exclusivamente na cidade de Matão/SP;</li>
            <li>Taxa de entrega: R$ 10,00;</li>
            <li>Clientes de outras localidades podem optar pela retirada no local;</li>
            <li>Prazo de entrega informado no momento da compra;</li>
            <li>É necessário apresentar documento com foto na entrega para confirmar maioridade.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Trocas e Devoluções</h2>
          <p>
            Conforme o Código de Defesa do Consumidor:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Produtos com defeito: troca em até 7 dias após o recebimento;</li>
            <li>Produtos lacrados não podem ser devolvidos após abertura;</li>
            <li>Para solicitar troca, entre em contato via WhatsApp;</li>
            <li>Não aceitamos devolução de produtos usados por questões de higiene e segurança.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo do site, incluindo logotipos, textos, imagens e design, é propriedade da Pod Gorillas
            ou de seus licenciadores, protegido por leis de propriedade intelectual.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Limitação de Responsabilidade</h2>
          <p>
            A Pod Gorillas não se responsabiliza por:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Uso inadequado dos produtos;</li>
            <li>Efeitos à saúde decorrentes do uso de produtos com nicotina;</li>
            <li>Danos causados por uso por menores de idade ou pessoas não autorizadas;</li>
            <li>Interrupções temporárias do site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">10. Disposições Gerais</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Estes termos são regidos pelas leis brasileiras;</li>
            <li>Qualquer disputa será resolvida no foro da comarca de Matão/SP;</li>
            <li>A Pod Gorillas pode modificar estes termos a qualquer momento;</li>
            <li>O uso continuado do site após modificações constitui aceitação dos novos termos.</li>
          </ul>
        </section>

        <section className="mt-8 p-6 bg-dark-800/50 rounded-2xl border border-dark-700">
          <h2 className="text-xl font-semibold text-white mb-3">Contato</h2>
          <p>
            Para dúvidas sobre estes Termos de Uso, entre em contato:
          </p>
          <ul className="mt-3 space-y-1">
            <li><strong>WhatsApp:</strong> (16) 99615-2900</li>
            <li><strong>Instagram:</strong> @pod.gorillas</li>
            <li><strong>Cidade:</strong> Matão - SP</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
