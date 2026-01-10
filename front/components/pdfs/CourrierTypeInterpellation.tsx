import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

type CourrierTypeInterpellationProps = {
  communityName: string;
  communityType: string;
};

export const CourrierTypeInterpellation = ({
  communityName,
  communityType,
}: CourrierTypeInterpellationProps) => {
  // Register font
  Font.register({
    family: 'Kanit',
    src: `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/Kanit-Regular.ttf`,
  });

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      fontFamily: 'Kanit',
      color: '#303F8D',
    },
    title: {
      fontSize: 18,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    section: { marginBottom: 10 },
    greyColor: { color: '#737373' },
    fontSizeBig: { fontSize: 12 },
    textAlignRight: { textAlign: 'right' },
    ul: { flexDirection: 'column', width: 400 },
    li: { flexDirection: 'row', marginBottom: 4 },
    bulletPoint: { marginHorizontal: 8 },
  });

  const date = new Date().toLocaleDateString();
  const communityTitle = communityType === 'Commune' ? 'Maire' : 'Président.e';

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/eclaireur/eclaireur-header-pdf.png`}
        ></Image>
        <Text style={[styles.textAlignRight, styles.fontSizeBig, { marginBottom: 30 }]}>
          <Text style={styles.greyColor}>DESTINATAIRE</Text> {communityName}
        </Text>
        <Text style={[styles.section, styles.textAlignRight, styles.fontSizeBig]}>
          <Text style={styles.greyColor}>Date</Text> {date}
        </Text>

        <Text style={[styles.section, styles.fontSizeBig]}>
          <Text style={styles.greyColor}>OBJET</Text> Éclaireur Public vous interpelle pour la
          transparence des données publiques
        </Text>

        <Text style={styles.section}>
          À l’attention de M. ou Mme le ou la {communityTitle} de {communityName}
        </Text>

        <Text style={styles.section}>
          En tant que citoyen·ne soucieux·se de la transparence et de la bonne gestion des fonds
          publics, je souhaite attirer votre attention sur l'obligation légale de publication des
          données relatives aux marchés publics et aux subventions octroyées pour les collectivités
          de plus de 3 500 habitants et comptant au moins 50 agents à temps plein.
        </Text>

        <Text style={styles.section}>
          Ces informations sont essentielles pour garantir une gestion claire et accessible des
          finances publiques. Elles permettent aux citoyen·nes de mieux comprendre les choix
          budgétaires, de renforcer la confiance dans les institutions et de s’assurer du bon usage
          de l’argent public.
        </Text>

        <Text style={styles.section}>
          Or, à ce jour, ces données restent souvent incomplètes ou difficilement accessibles.
        </Text>

        <Text style={styles.section}>
          Je vous encourage donc à publier et mettre à jour ces informations conformément aux
          obligations en vigueur, en facilitant leur consultation par l’ensemble des citoyen·nes.
          Une telle initiative contribuerait à une démocratie locale plus transparente et
          participative.
        </Text>

        <Text style={styles.section}>Pour en savoir plus : www.eclaireurpublic.fr</Text>

        <Text style={styles.section}>
          Vous disposez bien entendu d’un droit de réponse. Pour toute remarque, précision ou
          correction, vous pouvez contacter Anticor à : contact@anticor.com (adresse de contact
          dédiée). Pour améliorer le score de transparence de votre collectivité, vous pouvez
          transmettre les données manquantes :
        </Text>
        <View style={[styles.ul, styles.section]}>
          <View style={styles.li}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text>
              en les publiant directement sur www.data.gouv.fr conformément aux démarches prévues,
            </Text>
          </View>
          <View style={styles.li}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text>ou via la plateforme https://publier.etalab.studio/fr.</Text>
          </View>
        </View>

        <Text style={styles.section}>
          Pour plus d'informations, une page est dédiée sur le site :
          https://www.eclaireurpublic.fr/aide-aux-elus,
        </Text>

        <Text style={styles.section}>
          Je vous remercie par avance pour votre engagement sur ce sujet essentiel et reste à votre
          disposition pour échanger à ce propos.
        </Text>

        <Text style={styles.section}>
          Dans l’attente de votre retour, veuillez agréer, Madame, Monsieur, l’expression de mes
          salutations distinguées.
        </Text>
      </Page>
    </Document>
  );
};
