   );
  }

  /**
   * @param $object %%0%%
   * @param $data array
   * @return null
   */
  public function fromArray(&$object, $data)
  {
    foreach (array_keys($data) as $d) {
      switch ($d) {
