package coursework.config

import coursework.security.JwtAuthFilter
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthFilter,
    @Value("\${app.cors.allowed-origins}") private val allowedOriginsProp: String
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsSource()) }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                // public API
                auth.requestMatchers("/api/auth/**").permitAll()
                auth.requestMatchers(
                    "/swagger-ui.html", "/swagger-ui/**",
                    "/api-docs", "/api-docs/**"
                ).permitAll()
                // read — both roles
                auth.requestMatchers(HttpMethod.GET, "/api/**").authenticated()
                // write — TEACHER only
                auth.requestMatchers(HttpMethod.POST,   "/api/**").hasRole("TEACHER")
                auth.requestMatchers(HttpMethod.PUT,    "/api/**").hasRole("TEACHER")
                auth.requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("TEACHER")
                // everything else: static frontend (index.html, /assets/**) + SPA forwards
                auth.anyRequest().permitAll()
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsSource(): CorsConfigurationSource {
        val config = CorsConfiguration().apply {
            allowedOrigins = allowedOriginsProp.split(",").map { it.trim() }.filter { it.isNotEmpty() }
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = true
        }
        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", config)
        }
    }
}
