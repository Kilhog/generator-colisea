
  $type_menu = $em->getRepository('Type_menu')->findOneBy(array('nom' => 'Classique'));

  $data = new Menu();
  $data->setNom("%%0%%");
  $data->setModuleId($module_sample_object->getId());
  $data->setHash("%%1%%");
  $data->setParent(null);
  $data->setPosition(8);
  $data->setRoute("%%0%%.liste");
  $data->setIcone("fa");
  $data->setObjectName("%%0%%");
  $data->setActif(true);
  $data->setCss(null);
  $em->persist($data);

  $iconMenuTypeMenu = new IconMenu_TypeMenu();
  $iconMenuTypeMenu->setMenu($data);
  $iconMenuTypeMenu->setTypeMenu($type_menu);
  $iconMenuTypeMenu->setIcon("fa");
  $em->persist($iconMenuTypeMenu);

  $em->flush();