<template>
  <v-card elevation="5">
    <v-card-title>
      <v-row>
        <v-col>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="plain"
                icon
                v-bind="props"
                :disabled="!selecionadosNSU.length"
                @click="abrirDialogFinalizar"
              >
                <v-icon color="primary"> mdi-flag-checkered </v-icon>
              </v-btn>
            </template>
            <span>Finalizar Demandas Selecionadas</span>
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="plain"
                icon
                v-bind="props"
                :disabled="!selecionadosNSU.length"
                @click="selecionarResponsavel"
              >
                <v-icon color="primary">mdi-account-check </v-icon>
              </v-btn>
            </template>
            <span>Designar Demandas Selecionadas</span>
          </v-tooltip>

          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="plain"
                icon
                v-bind="props"
                :disabled="!selecionadosNSU.length"
                @click="selecionadosNSU = []"
              >
                <v-icon color="primary"> mdi-flag-minus </v-icon>
              </v-btn>
            </template>
            <span>Desmarcar Todas</span>
          </v-tooltip>

          <v-dialog v-model="dialogFinalizar" persistent max-width="700px">
            <v-card>
              <v-card-title>Finalizar Demandas Selecionadas</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-textarea
                      v-model="observacao"
                      label="Observação"
                      outlined
                      rows="3"
                      clearable
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="dialogFinalizar = false">Cancelar</v-btn>
                <v-btn @click="finalizarDemandas">Finalizar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          

