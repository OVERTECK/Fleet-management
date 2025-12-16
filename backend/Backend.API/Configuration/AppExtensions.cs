using Backend.API.EndpointsSettings;
using Backend.DataAccess;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Backend.API.Configuration;

public static class AppExtensions
{
    public static IApplicationBuilder Configure(this WebApplication app)
    {
        app.UseSerilogRequestLogging();

        app.UseRouting();

        app.UseCookiePolicy(new CookiePolicyOptions
        {
            MinimumSameSitePolicy = SameSiteMode.Strict,
            HttpOnly = HttpOnlyPolicy.Always,
            Secure = CookieSecurePolicy.Always,
        });

        app.UseCors("AllowFrontend");

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseAntiforgery();

        app.UseSwagger();
        app.UseSwaggerUI();

        app.MapEndpoints();

        return app;
    }
}