export type InstrumentData = {
  id: number; // a unique identifier for the instrument
  name: string; // the name of the instrument
  description: string; // a detailed description of the instrument
  type: string; // the type or category the instrument belongs to
  infoPage: string; // a URL linking to more information about the instrument
};

// An array of instrument objects
// Each object should conform to the structure defined in InstrumentData
export const instruments: InstrumentData[] = [
  {
    id: 1,
    name: 'ALF',
    description:
      'ALF is an alignment facility for single crystals. Our aim is to provide a quick, intuitive, rapid access facility for the alignment and assessment of single crystals for users of the main ISIS excitation instruments.',
    type: 'Excitations',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/ALF.aspx',
  },
  {
    id: 2,
    name: 'ARGUS',
    description:
      'A muon spectrometer for condensed matter and molecular studies. The muon instrument Argus (Advanced Riken General-purpose mUsr Spectrometer) is housed in Port 2 of the RIKEN-RAL Muon Facility. It can be used for a wide variety of studies in the areas of magnetism, superconductivity, charge transport, molecular and polymeric materials and semiconductors.',
    type: 'Muon Spectrometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/ARGUS.aspx',
  },
  {
    id: 3,
    name: 'CHIPIR',
    description:
      'Chipir is one of the first dedicated facilities outside of the US to look at how silicon microchips respond to cosmic neutron radiation. The instrument offers users the ability to perform electronics testing at highly accelerated rate with a measurement of just one hour being equivalent to exposing microchips to high-energy neutrons for hundreds to thousands of years in the real environment. Such accelerated atmospheric neutron testing is designed to mimic the real disruptions and failure, the so-called ‘single event effects’ experienced by electronics, and allow industry to develop strategies, designs and methods to mitigate their effects',
    type: 'Chip Irradiation',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/Chip-Irradiation-.aspx',
  },
  {
    id: 4,
    name: 'CHRONUS',
    description:
      'CHRONUS is one of the suite of muon instruments at ISIS and was built by RIKEN. The spectrometer is located in Port 4 of the RIKEN-RAL facility. CHRONUS has 606 detectors and can be used for both zero field and longitudinal field experiments. Longitudinal fields of up to 3950 G can be applied making it similar to EMU. In addition the spectrometer can also be rotated allowing one to also perform high transverse field experiments, however this is still under development. There are a wide range of sample environment that ranges from 0.3 to 500K',
    type: 'Muon Spectrometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/CHRONUS.aspx',
  },
  {
    id: 5,
    name: 'CRISP',
    description:
      'CRISP Reflectometer. CRISP is one of five Neutron Reflectometers (NR) at ISIS. It is the original instrument and was designed for high resolution studies of a wide range of interfacial phenomena. The instrument is highly automated, allowing reproducible measurements to be made with high precision, and the sample geometry is horizontal to facilitate the study of liquid surfaces. CRISP, unlike its sister instrument SURF, can also perform polarised neutron reflectivity (PNR) measurements with full polarisation analysis. There is also overhead crane access for the installation of large items of sample environment.',
    type: 'Reflectometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/Crisp.aspx',
  },
  {
    id: 6,
    name: 'DEVA',
    description:
      'Deva was a partly scheduled instrument, equipped with a dedicated spectrometer for studies using the radio-frequency mSR technique. It was also used for developing new techniques, and for more specialised experiments.',
    type: 'Muon Spectrometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/DEVA.aspx',
  },
  {
    id: 7,
    name: 'EMMAA',
    description:
      'EMMA is an instrument used mainly for detector testing, but also testing various beamline components. It can be run in many different modes including diffraction, spectroscopy and direct beam geometries.',
    type: 'Testing',
    infoPage: '', // No information page provided
  },
  {
    id: 8,
    name: 'EMU',
    description:
      'EMU is a new 96-detector µSR spectrometer which is optimised for zero field and longitudinal field measurements. Fields of up to 4500 G can be applied (this can be extended to 5000G if required), and sample temperatures in the range of 50mK to 1500K can be produced using a variety of sample environment equipment.',
    type: 'Muon Spectrometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/EMU.aspx',
  },
  {
    id: 9,
    name: 'ENGINX',
    description:
      "ENGIN-X is a dedicated engineering science facility at ISIS. The beamline is optimized for the measurement of strain, and thus stress, deep within a crystalline material, using the atomic lattice planes as an atomic 'strain gauge'. Internal and residual stresses in materials have a considerable effect on material properties, including fatigue resistance, fracture toughness and strength.",
    type: 'Diffractometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/Engin-X.aspx',
  },
  {
    id: 10,
    name: 'EVS',
    description:
      'The original eVS instrument operated at the ISIS pulsed source since the year 1985, and pioneered the inelastic neutron scattering at the eV energy in the last decades.',
    type: 'Spectrometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/VESUVIO.aspx',
  },
  {
    id: 11,
    name: 'GEM',
    description:
      'GEM The General Materials Diffractometer is a new generation neutron diffractometer recently constructed at the ISIS pulsed neutron source. GEM can be used to perform high intensity, high resolution experiments to study the structure of disordered materials and crystalline powders.',
    type: 'Crystallography Diffractometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/GEM.aspx',
  },
  {
    id: 12,
    name: 'HET',
    description:
      'Het Spectrometer. Investigations on Het have broadened from studies of high energy magnetic excitations and the dynamics of hydrogen metal systems into the fields of quantum magnetism and non-Fermi liquids. Het is optimised to measure high energy magnetic excitations. Although originally optimised for magnetic studies with most of its detectors positioned at angles below 30¿, it is also used for investigations of dynamics in many other materials including disordered and biological systems. It has produced a large number of important results from powders, amorphous materials and single crystals.',
    type: 'Excitations',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/HET.aspx',
  },
  {
    id: 13,
    name: 'HIFI',
    description:
      'The new high-field muon instrument at ISIS, called HiFi, provides applied longitudinal fields up to 5 T. The magnet is a 5 T superconducting split-pair, with high field homogeneity over the sample volume and actively compensated stray field. It has additional z-axis coils up to 400 G for small changes to the main field (for example, for sweeping through level crossing resonances) as well as 150 G x- and y-axis transverse coils for calibration measurements, etc.',
    type: 'Muon Spectrometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/HiFi.aspx',
  },
  {
    id: 14,
    name: 'HRPD',
    description:
      'HRPD, the High Resolution Powder Diffractometer, is the highest resolution neutron powder diffractometer of its type in the world.',
    type: 'Crystallography Diffractometer',
    infoPage: 'https://www.isis.stfc.ac.uk/Pages/HRPD.aspx',
  },
];
